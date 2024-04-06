import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  CreateProductResponse,
  DecreaseProductDto,
  DecreaseProductResponse,
  DeleteProductResponse,
  FindAllProductsResponse,
  FindOneProductDto,
  FindOneProductResponse,
  ProductServiceController,
  ProductServiceControllerMethods,
  UpdateProductDto,
  UpdateProductResponse,
} from '@app/common';

@Controller()
@ProductServiceControllerMethods()
export class ProductsController implements ProductServiceController {
  constructor(private readonly productsService: ProductsService) {}

  createProduct(createProductDto: CreateProductDto): Promise<CreateProductResponse> {
    return this.productsService.create(createProductDto);
  }

  async findAllProducts(): Promise<FindAllProductsResponse> {
    return this.productsService.findAll();
  }

  findOneProduct(findOneProductDto: FindOneProductDto): Promise<FindOneProductResponse> {
    return this.productsService.findOne(findOneProductDto.id);
  }

  updateProduct(updateProductDto: UpdateProductDto): Promise<UpdateProductResponse> {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  deleteProduct(request: FindOneProductDto): Promise<DeleteProductResponse> {
    return this.productsService.remove(request.id);
  }

  decreaseStock(request: DecreaseProductDto): Promise<DecreaseProductResponse> {
    return this.productsService.decreaseStock(request);
  }
}
