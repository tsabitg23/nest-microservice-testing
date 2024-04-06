import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, CreateProductResponse, DecreaseProductDto, DecreaseProductResponse, DeleteProductResponse, FindAllProductsResponse, FindOneProductResponse, UpdateProductDto, UpdateProductResponse } from "@app/common";
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<CreateProductResponse> {
    const product = this.productRepository.create(createProductDto);
    try {
      await this.productRepository.save(product);
    } catch (e) {
      return {
        productId: product.id,
        status: HttpStatus.BAD_REQUEST,
        error: e.message || "Bad request",
      }
    }
    return {
      productId: product.id,
      status: HttpStatus.CREATED,
      error: '',
    }
  }

  async findAll(): Promise<FindAllProductsResponse> {
    const products = await this.productRepository.find({
      where: {
        isArchived: false,
      },
    });
    return {
      data: products.map(product => {
        return {
          ...product,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt && product.updatedAt.toISOString(),
        }
      }),
      status: HttpStatus.OK,
      error: '',
    };
  }

  async findOne(id: string):Promise<FindOneProductResponse> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    if(!product) {
      return {
        data: null,
        status: HttpStatus.NOT_FOUND,
        error: `Product with id ${id} not found`,
      }
    }

    return {
      data: {
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt && product.updatedAt.toISOString(),
      },
      status: HttpStatus.OK,
      error: '',
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<UpdateProductResponse> {
    try {
      const updatedUser = await this.productRepository.update(id, updateProductDto);
      if(updatedUser.affected === 0) {
        return {
          productId: id,
          status: HttpStatus.NOT_FOUND,
          error: `Product with id ${id} not found`,
        }
      }
    } catch (e) {
      return {
        productId: id,
        status: HttpStatus.BAD_REQUEST,
        error: e.message || "Bad request",
      }
    }
    
    return {
      productId: id,
      status: HttpStatus.OK,
      error: '',
    }
  }

  async remove(id: string): Promise<DeleteProductResponse> {
    try {
      const removedUser = await this.productRepository.update(id, {
        isArchived: true,
      });
      if(removedUser.affected === 0) {
        return {
          productId: id,
          status: HttpStatus.NOT_FOUND,
          error: `Product with id ${id} not found`,
        }
      }
    } catch (e){
      return {
        productId: id,
        status: HttpStatus.BAD_REQUEST,
        error: e.message || "Bad request",
      }
    }
    return {
      productId: id,
      status: HttpStatus.OK,
      error: '',
    }
  }

  async decreaseStock(request: DecreaseProductDto): Promise<DecreaseProductResponse> {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id: request.id,
        },
      });
      if(!product) {
        return {
          productId: request.id,
          status: HttpStatus.NOT_FOUND,
          error: `Product with id ${request.id} not found`,
        }
      }
  
      if(product.stock - request.quantity < 0) {
        return {
          productId: request.id,
          status: HttpStatus.BAD_REQUEST,
          error: `Product with id ${request.id} has insufficient stock`,
        }
      }
  
      product.stock -= request.quantity;
      await this.productRepository.save(product);
      return {
        productId: request.id,
        status: HttpStatus.OK,
        error: '',
      }
    } catch (e) {
      return {
        productId: request.id,
        status: HttpStatus.BAD_REQUEST,
        error: e.message || "Bad request",
      }
    }
  }
}
