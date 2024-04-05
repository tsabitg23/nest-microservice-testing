import { Injectable } from '@nestjs/common';
import { CreateProductDto, Product, UpdateProductDto } from "@app/common";
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
    return this.productRepository.create(createProductDto);
  }

  async findAll() {
    const products = await this.productRepository.find({
      where: {
        isArchived: false,
      },
    });
    return {
      products,
    };
  }

  findOne(id: string) {
    return this.productRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.productRepository.update(id, {
      isArchived: true,
    });
    return this.findOne(id);
  }
}
