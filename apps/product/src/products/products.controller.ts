import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  FindOneProductDto,
  Product,
  ProductServiceController,
} from '@app/common';

@Controller()
export class ProductsController implements ProductServiceController {
  constructor(private readonly productsService: ProductsService) {}

  createProduct(createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  findAllProducts() {
    return this.productsService.findAll();
  }

  findOneProduct(findOneProductDto: FindOneProductDto) {
    return this.productsService.findOne(findOneProductDto.id);
  }

  updateProduct(updateProductDto: Product) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  deleteProduct(request: FindOneProductDto) {
    return this.productsService.remove(request.id);
  }
}
