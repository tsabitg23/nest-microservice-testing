/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "product";

export interface Empty {
}

export interface FindOneProductDto {
  id: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface Products {
  products: Product[];
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
  findOneProduct(request: FindOneProductDto): Observable<Product>;

  findAllProducts(request: Empty): Observable<Products>;

  createProduct(request: CreateProductDto): Observable<Product>;

  updateProduct(request: UpdateProductDto): Observable<Product>;

  deleteProduct(request: FindOneProductDto): Observable<Product>;
}

export interface ProductServiceController {
  findOneProduct(request: FindOneProductDto): Promise<Product> | Observable<Product> | Product;

  findAllProducts(request: Empty): Promise<Products> | Observable<Products> | Products;

  createProduct(request: CreateProductDto): Promise<Product> | Observable<Product> | Product;

  updateProduct(request: UpdateProductDto): Promise<Product> | Observable<Product> | Product;

  deleteProduct(request: FindOneProductDto): Promise<Product> | Observable<Product> | Product;
}

export function ProductServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "findOneProduct",
      "findAllProducts",
      "createProduct",
      "updateProduct",
      "deleteProduct",
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
