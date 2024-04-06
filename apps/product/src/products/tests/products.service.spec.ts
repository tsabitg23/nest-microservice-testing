import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../products.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockProducts } from './products.test.utils';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<ProductEntity>;
  let mockData: ProductEntity[] = [];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(ProductEntity),
          useClass: Repository
        }
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity))
    mockData = mockProducts;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all products', async () => {
    jest
      .spyOn(repository, "find")
      .mockResolvedValue(mockData);
    const products = await service.findAll();
    const expectedResult = mockData.map(product => {
      return {
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt && product.updatedAt.toISOString(),
      }
    });
    expect(products.data).toEqual(expectedResult);
  });

  it('should get one products', async () => {
    const mockProduct = mockData[0];
    jest
      .spyOn(repository, "findOne")
      .mockResolvedValue(mockProduct);
    const product = await service.findOne(mockProduct.id);
    const expectedResult = {
      ...mockProduct,
      createdAt: mockProduct.createdAt.toISOString(),
      updatedAt: mockProduct.updatedAt && mockProduct.updatedAt.toISOString(),
    };
    expect(product).toEqual(expectedResult);
  });

  it('should create a product', async () => {
    // const mockProduct = mockData[0];
    // jest
    //   .spyOn(repository, "create")
    //   .mockReturnValue(mockProduct);
    // jest
    //   .spyOn(repository, "save")
    //   .mockResolvedValue(mockProduct);
    // const product = await service.create(mockProduct);
    // const expectedResult = {
    //   ...mockProduct,
    //   createdAt: mockProduct.createdAt.toISOString(),
    //   updatedAt: mockProduct.updatedAt && mockProduct.updatedAt.toISOString(),
    // };
    // expect(product).toEqual(expectedResult);
  });
});
