import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, DecreaseProductDto, Product, Products, UpdateProductDto } from "@app/common";
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    return {
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt && product.updatedAt.toISOString(),
    }
  }

  async findAll(): Promise<Products> {
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
    };
  }

  async findOne(id: string):Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    return {
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt && product.updatedAt.toISOString(),
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updatedUser = await this.productRepository.update(id, updateProductDto);
    if(updatedUser.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    const removedUser = await this.productRepository.update(id, {
      isArchived: true,
    });
    if(removedUser.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return this.findOne(id);
  }

  async decreaseStock(request: DecreaseProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: request.id,
      },
    });
    if(!product) {
      throw new NotFoundException(`Product with id ${request.id} not found`);
    }

    if(product.stock - request.quantity < 0) {
      throw new BadRequestException(`Product with id ${request.id} has insufficient stock`);
    }

    product.stock -= request.quantity;
    await this.productRepository.save(product);
    return {
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt && product.updatedAt.toISOString(),
    }
  }
}
