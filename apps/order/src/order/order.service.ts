import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto, Order, Orders, Product, PRODUCT_SERVICE_NAME, ProductServiceClient } from '@app/common';
import { PRODUCT_SERVICE } from '../config/constants';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderProductsEntity } from './entities/orderProducts.entity';

@Injectable()
export class OrderService implements OnModuleInit {
  private productService: ProductServiceClient
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderProductsEntity)
    private orderProductRepository: Repository<OrderProductsEntity>,
    @Inject(PRODUCT_SERVICE)
    private productServiceClient: ClientGrpc,
    private dataSource: DataSource
  ) {}

  onModuleInit() {
    this.productService = this.productServiceClient.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  async getAllOrders(): Promise<Orders> {
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
      })
    }
  }
  
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    let totalPrice = 0;

    const orderData = await this.orderRepository.create(createOrderDto);
    let orderProducts:OrderProductsEntity[] = [];
    // check stock
    for (const product of createOrderDto.products) {
      const productData = await this.getProductDetail(product.productId); 
      const isOutOfStock = productData.stock - product.quantity < 0;
      if (isOutOfStock) {
        throw new Error(`Product ${productData.name} is out of stock`);
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
      ...orderData,
      createdAt: orderData.createdAt.toISOString(),
      updatedAt: orderData.updatedAt && orderData.updatedAt.toISOString(),
    };
  }

  private async getProductDetail(productId: string): Promise<Product> {
    const productObservable = this.productService.findOneProduct({ id: productId});
    const product = await firstValueFrom(productObservable);
    return product;
  }

  private async decreaseStock(productId: string, quantity: number): Promise<boolean> {
    const productObservable = this.productService.decreaseStock({ id: productId, quantity: quantity});
    const product = await firstValueFrom(productObservable);
    return !!product.id;
  }
}
