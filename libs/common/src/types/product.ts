/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

// export const protobufPackage = "product";

export interface Empty {
}

export interface FindOneProductDto {
  id: string;
}

export interface FindOneProductResponse {
  data: Product | undefined;
  status: number;
  error: string;
}

export interface FindAllProductsResponse {
  data: Product[];
  status: number;
  error: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface CreateProductResponse {
  productId: string;
  status: number;
  error: string;
}

export interface UpdateProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProductResponse {
  productId: string;
  status: number;
  error: string;
}

export interface DecreaseProductDto {
  id: string;
  quantity: number;
}

export interface DecreaseProductResponse {
  productId: string;
  status: number;
  error: string;
}

export interface DeleteProductResponse {
  productId: string;
  status: number;
  error: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export const PRODUCT_PACKAGE_NAME = "product";

export interface ProductServiceClient {
  findOneProduct(request: FindOneProductDto): Observable<FindOneProductResponse>;

  findAllProducts(request: Empty): Observable<FindAllProductsResponse>;

  createProduct(request: CreateProductDto): Observable<CreateProductResponse>;

  updateProduct(request: UpdateProductDto): Observable<UpdateProductResponse>;

  deleteProduct(request: FindOneProductDto): Observable<DeleteProductResponse>;

  decreaseStock(request: DecreaseProductDto): Observable<DecreaseProductResponse>;
}

export interface ProductServiceController {
  findOneProduct(
    request: FindOneProductDto,
  ): Promise<FindOneProductResponse> | Observable<FindOneProductResponse> | FindOneProductResponse;

  findAllProducts(
    request: Empty,
  ): Promise<FindAllProductsResponse> | Observable<FindAllProductsResponse> | FindAllProductsResponse;

  createProduct(
    request: CreateProductDto,
  ): Promise<CreateProductResponse> | Observable<CreateProductResponse> | CreateProductResponse;

  updateProduct(
    request: UpdateProductDto,
  ): Promise<UpdateProductResponse> | Observable<UpdateProductResponse> | UpdateProductResponse;

  deleteProduct(
    request: FindOneProductDto,
  ): Promise<DeleteProductResponse> | Observable<DeleteProductResponse> | DeleteProductResponse;

  decreaseStock(
    request: DecreaseProductDto,
  ): Promise<DecreaseProductResponse> | Observable<DecreaseProductResponse> | DecreaseProductResponse;
}

export function ProductServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "findOneProduct",
      "findAllProducts",
      "createProduct",
      "updateProduct",
      "deleteProduct",
      "decreaseStock",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PRODUCT_SERVICE_NAME = "ProductService";
