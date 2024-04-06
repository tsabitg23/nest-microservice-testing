import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, CreateOrderResponse, GetAllOrderDto, GetAllOrderResponse, Order, Orders, OrderServiceController, OrderServiceControllerMethods } from '@app/common';
import { Observable } from 'rxjs';

@Controller()
@OrderServiceControllerMethods()
export class OrderController implements OrderServiceController {
  constructor(private readonly orderService: OrderService) {}

  createOrder(createOrderDto: CreateOrderDto): Promise<CreateOrderResponse>{
    return this.orderService.createOrder(createOrderDto);
  }

  getAllOrders(request: GetAllOrderDto): Promise<GetAllOrderResponse> {
    return this.orderService.getAllOrders();
  }
}
