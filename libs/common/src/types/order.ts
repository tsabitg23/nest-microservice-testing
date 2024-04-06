/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

// export const protobufPackage = "order";

export interface GetAllOrderDto {
}

export interface CreateOrderDto {
  userId: string;
  products: CreateOrderProductsDto[];
}

export interface CreateOrderResponse {
  orderId: string;
  status: number;
  error: string;
}

export interface CreateOrderProductsDto {
  productId: string;
  quantity: number;
}

export interface GetAllOrderResponse {
  data: Order[];
  status: number;
  error: string;
}

export interface Orders {
  data: Order[];
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
  createOrder(request: CreateOrderDto): Observable<CreateOrderResponse>;

  getAllOrders(request: GetAllOrderDto): Observable<GetAllOrderResponse>;
}

export interface OrderServiceController {
  createOrder(
    request: CreateOrderDto,
  ): Promise<CreateOrderResponse> | Observable<CreateOrderResponse> | CreateOrderResponse;

  getAllOrders(
    request: GetAllOrderDto,
  ): Promise<GetAllOrderResponse> | Observable<GetAllOrderResponse> | GetAllOrderResponse;
}

export function OrderServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createOrder", "getAllOrders"];
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
