import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto, CreateOrderResponse, GetAllOrderResponse, Order, Orders, Product, PRODUCT_SERVICE_NAME, ProductServiceClient } from '@app/common';
import { PRODUCT_SERVICE } from '../config/constants';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderProductsEntity } from './entities/orderProducts.entity';

@Injectable()
export class OrderService implements OnModuleInit {
  private productService: ProductServiceClient;
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @Inject(PRODUCT_SERVICE)
    private productServiceClient: ClientGrpc,
    private dataSource: DataSource
  ) {}

  onModuleInit() {
    this.productService = this.productServiceClient.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  async getAllOrders(): Promise<GetAllOrderResponse> {
    const data = await this.orderRepository.find({
      where: {
        isArchived: false
      },
      relations: ['orderProducts']
    });
    return {
      data: data.map(order => {
        return {
          ...order,
          createdAt: order.createdAt.toISOString(),
          updatedAt: order.updatedAt && order.updatedAt.toISOString(),
        }      
      }),
      status: HttpStatus.OK,
      error: ''
    }
  }
  
  async createOrder(createOrderDto: CreateOrderDto): Promise<CreateOrderResponse> {
    try {
      let totalPrice = 0;
      const orderData = await this.orderRepository.create(createOrderDto);
      let orderProducts:OrderProductsEntity[] = [];
      // check stock
      for (const product of createOrderDto.products) {
        const productData = await this.getProductDetail(product.productId); 
        const isOutOfStock = productData.stock - product.quantity < 0;
        if (isOutOfStock) {
          throw new Error(`Insufficient stock for Product ${productData.name}`);
        }
        const subTotal = productData.price * product.quantity;
        totalPrice += subTotal;
        const item = new OrderProductsEntity();
        item.productId = product.productId;
        item.quantity = product.quantity;
        item.price = productData.price;
        item.order = orderData;
        orderProducts.push(item);
      }

      orderData.totalPrice = totalPrice;
      orderData.orderProducts = orderProducts;
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.save(OrderEntity, orderData);
        await queryRunner.manager.save(OrderProductsEntity, orderProducts);
        for (const product of createOrderDto.products) {
          await this.decreaseStock(product.productId, product.quantity);
        }
        await queryRunner.commitTransaction();
      } catch (e) {
        await queryRunner.rollbackTransaction();
        throw e;
      } finally {
        await queryRunner.release();
      }
      return {
        orderId: orderData.id,
        status: HttpStatus.CREATED,
        error: '',
      };
    } catch (e){
      return {
        orderId: '',
        status: HttpStatus.BAD_REQUEST,
        error: e.message || 'Bad request',
      }
    }
  }

  private async getProductDetail(productId: string): Promise<Product> {
    const productObservable = this.productService.findOneProduct({ id: productId});
    const product = await firstValueFrom(productObservable);
    if(!product.data) {
      throw new Error(`Product with id ${productId} not found`);
    }
    return product.data;
  }

  private async decreaseStock(productId: string, quantity: number): Promise<boolean> {
    const productObservable = this.productService.decreaseStock({ id: productId, quantity: quantity});
    const product = await firstValueFrom(productObservable);
    return !!product.productId;
  }
}
