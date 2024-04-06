import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  FindOneProductDto,
  Product,
  Products,
  ProductServiceController,
  ProductServiceControllerMethods,
  UpdateProductDto,
} from '@app/common';

@Controller()
@ProductServiceControllerMethods()
export class ProductsController implements ProductServiceController {
  constructor(private readonly productsService: ProductsService) {}

  createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  async findAllProducts(): Promise<Products> {
    return this.productsService.findAll();
  }

  findOneProduct(findOneProductDto: FindOneProductDto) {
    return this.productsService.findOne(findOneProductDto.id);
  }

  updateProduct(updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  deleteProduct(request: FindOneProductDto): Promise<Product> {
    return this.productsService.remove(request.id);
  }
}
