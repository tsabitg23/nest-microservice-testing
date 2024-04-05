/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "product";

export interface PaginationDto {
  page: number;
  limit: number;
}

export interface Empty {
}

export interface findOneProductDto {
  id: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
}

export interface Products {
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const PRODUCT_PACKAGE_NAME = "product";

export interface ProductServiceClient {
  findOneProduct(request: findOneProductDto): Observable<Product>;

  getAllProducts(request: Empty): Observable<Products>;

  createProduct(request: CreateProductDto): Observable<Product>;

  updateProduct(request: Product): Observable<Product>;

  deleteProduct(request: findOneProductDto): Observable<Product>;

  queryProducts(request: Observable<PaginationDto>): Observable<Products>;
}

export interface ProductServiceController {
  findOneProduct(request: findOneProductDto): Promise<Product> | Observable<Product> | Product;

  getAllProducts(request: Empty): Promise<Products> | Observable<Products> | Products;

  createProduct(request: CreateProductDto): Promise<Product> | Observable<Product> | Product;

  updateProduct(request: Product): Promise<Product> | Observable<Product> | Product;

  deleteProduct(request: findOneProductDto): Promise<Product> | Observable<Product> | Product;

  queryProducts(request: Observable<PaginationDto>): Observable<Products>;
}

export function ProductServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "findOneProduct",
      "getAllProducts",
      "createProduct",
      "updateProduct",
      "deleteProduct",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ["queryProducts"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PRODUCT_SERVICE_NAME = "ProductService";
