import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto, Order, PRODUCT_SERVICE_NAME, ProductServiceClient } from '@app/common';
import { PRODUCT_SERVICE } from '../config/constants';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderService implements OnModuleInit {
  private productService: ProductServiceClient
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @Inject(PRODUCT_SERVICE)
    private productServiceClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.productService = this.productServiceClient.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }
  
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    // check stock
    for (const product of createOrderDto.products) {
      if (!await this.isProductInStock(product.productId, product.quantity)) {
        throw new Error(`Product ${product.productId} is out of stock`);
      }
    }
    const orderProducts = await this.orderRepository.create(createOrderDto);
    return orderProducts;
  }

  private async isProductInStock(productId: string, quantity: number): Promise<boolean> {
    const productObservable = this.productService.findOneProduct({ id: productId});
    const product = await firstValueFrom(productObservable);
    return product.stock - quantity >= 0;
  }
}
