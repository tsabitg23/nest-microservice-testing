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
    expect(product.data).toEqual(expectedResult);
  });

  it('should create a product', async () => {
    const mockProduct = mockData[0];
    jest
      .spyOn(repository, "create")
      .mockReturnValue(mockProduct);
    jest
      .spyOn(repository, "save")
      .mockResolvedValue(mockProduct);
    const product = await service.create(mockProduct);
    const expectedResult = {
      productId: mockProduct.id,
      status: 201,
      error: '',
    };
    expect(product).toEqual(expectedResult);
  });

  it('should update a product', async () => {
    const mockProduct = mockData[0];
    jest
      .spyOn(repository, "findOne")
      .mockResolvedValue(mockProduct);
      jest
      .spyOn(repository, "update")
      .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: []});
    const product = await service.update(mockProduct.id, mockProduct);
    const expectedResult = {
      productId: mockProduct.id,
      status: 200,
      error: '',
    };
    expect(product).toEqual(expectedResult);
    expect(repository.update).toHaveBeenCalledWith(mockProduct.id, mockProduct);
  });

  it('should delete a product', async () => {
    const mockProduct = mockData[0];
    jest
      .spyOn(repository, "findOne")
      .mockResolvedValue(mockProduct);
    jest
      .spyOn(repository, "update")
      .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: []});
    const product = await service.remove(mockProduct.id);
    const expectedResult = {
      productId: mockProduct.id,
      status: 200,
      error: '',
    };
    expect(product).toEqual(expectedResult);
    expect(repository.update).toHaveBeenCalledWith(mockProduct.id, { isArchived: true});
  });

  it('should decrease stock', async () => {
    const mockProduct = mockData[0];
    jest
      .spyOn(repository, "findOne")
      .mockResolvedValue(mockProduct);
    jest
      .spyOn(repository, "save")
      .mockResolvedValue(mockProduct);
    const product = await service.decreaseStock({id: mockProduct.id, quantity: 1});
    const expectedResult = {
      productId: mockProduct.id,
      status: 200,
      error: '',
    };
    expect(product).toEqual(expectedResult);
    expect(repository.save).toHaveBeenCalledWith(mockProduct);
  });
});
