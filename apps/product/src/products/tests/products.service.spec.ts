import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../products.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockProducts } from './products.test.utils';
import { TestDatabaseModule } from '../../utils/datasource.provider';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<ProductEntity>;
  let ProductEntityRepositoryToken = getRepositoryToken(ProductEntity);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule
      ],
      providers: [
        ProductsService,
        {
          provide: ProductEntityRepositoryToken,
          useClass: Repository<ProductEntity>
        }
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<ProductEntity>>(ProductEntityRepositoryToken);
    await repository.save(mockProducts);
  });

  afterAll(async () => {
    await repository.query(`TRUNCATE TABLE "product" CASCADE;`);
  })

  it('should get all products', async () => {
    const result = await service.findAll();
    expect(result.data.length).toEqual(mockProducts.length);
  });

  it('should get one products', async () => {
    const result = await service.findOne(mockProducts[0].id);
    const expectedProduct = {
      ...mockProducts[0],
      price: mockProducts[0].price.toFixed(2),
      createdAt: mockProducts[0].createdAt.toISOString(),
    }
    expect(result.data).toEqual(expect.objectContaining(expectedProduct));
  });

  it('Find One > ID not found', async () => {
    const testProduct = await service.findOne('eeb617d0-f12c-4575-9a4c-642389583db9');
    expect(testProduct.error).toEqual('Product with id eeb617d0-f12c-4575-9a4c-642389583db9 not found');
    expect(testProduct.status).toEqual(404);
  });

  it('should create a product', async () => {
    const testProduct = await service.create(mockProducts[0]);
    const expectedResult = {
      productId: testProduct.productId,
      status: 201,
      error: '',
    };
    expect(testProduct).toEqual(expectedResult);
    const expectedProduct = {
      ...mockProducts[0],
      price: mockProducts[0].price.toFixed(2),
    }
    const queryResult = await repository.findOne({where: {id: testProduct.productId}});
    expect(queryResult).toEqual(expect.objectContaining(expectedProduct));
  });

  it('should update a product', async () => {
    const updatedData = {
      ...mockProducts[0],
      name: 'new name'
    }
    const testProduct = await service.update(updatedData.id, updatedData);
    const expectedResult = {
      productId: testProduct.productId,
      status: 200,
      error: '',
    };
    expect(testProduct).toEqual(expectedResult);
    const queryResult = await repository.findOne({where: {id: testProduct.productId}});
    expect(queryResult.name).toEqual(updatedData.name);
  });

  it('Update > ID not found', async () => {
    const testProduct = await service.update('eeb617d0-f12c-4575-9a4c-642389583db9', mockProducts[0]);
    expect(testProduct.error).toEqual('Product with id eeb617d0-f12c-4575-9a4c-642389583db9 not found');
    expect(testProduct.status).toEqual(404);
  })

  it('should delete a product', async () => {
    await service.remove(mockProducts[0].id);
    const result = await service.findOne(mockProducts[0].id);
    const queryResult = await repository.find({where: {id: mockProducts[0].id, isArchived: false}});
    expect(queryResult.length).toEqual(0);
  });

  it('should decrease stock', async () => {
    await service.decreaseStock({id: mockProducts[0].id, quantity: 1});
    const queryResult = await repository.findOne({where: {id: mockProducts[0].id}});
    expect(queryResult.stock).toEqual(mockProducts[0].stock - 1);
  });
});
