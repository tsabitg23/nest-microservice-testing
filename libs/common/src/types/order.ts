/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

// export const protobufPackage = "order";

export interface CreateOrderDto {
  totalPrice: number;
  userId: string;
  products: CreateOrderProductsDto[];
}

export interface CreateOrderProductsDto {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  totalPrice: number;
  userId: string;
  orderProducts: OrderProducts[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderProducts {
  productId: string;
  quantity: number;
  price: number;
}

export const ORDER_PACKAGE_NAME = "order";

export interface OrderServiceClient {
  createOrder(request: CreateOrderDto): Observable<Order>;
}

export interface OrderServiceController {
  createOrder(request: CreateOrderDto): Promise<Order> | Observable<Order> | Order;
}

export function OrderServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createOrder"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("OrderService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("OrderService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ORDER_SERVICE_NAME = "OrderService";
