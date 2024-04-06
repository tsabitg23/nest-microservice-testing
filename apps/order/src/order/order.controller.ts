import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, Order, OrderServiceController, OrderServiceControllerMethods } from '@app/common';

@Controller()
@OrderServiceControllerMethods()
export class OrderController implements OrderServiceController {
  constructor(private readonly orderService: OrderService) {}

  createOrder(createOrderDto: CreateOrderDto): Promise<Order>{
    return this.orderService.createOrder(createOrderDto);
  }
}
