import { Injectable, NotFoundException } from '@nestjs/common';
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
}
