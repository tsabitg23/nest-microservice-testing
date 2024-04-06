import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto, Order } from '@app/common';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}
  
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const orderProducts = await this.orderRepository.create(createOrderDto);
    return orderProducts;
  }
}
