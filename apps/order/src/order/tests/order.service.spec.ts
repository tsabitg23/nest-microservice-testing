import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockOrders } from './order.test.utils';
import { OrderService } from '../order.service';
import { OrderEntity } from '../entities/order.entity';
import { TestDatabaseModule } from '../utils/datasource.provider';
import { PRODUCT_SERVICE } from '../../config/constants';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<OrderEntity>;
  let OrderEntityRepositoryToken = getRepositoryToken(OrderEntity);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule
      ],
      providers: [
        OrderService,
        {
          provide: OrderEntityRepositoryToken,
          useClass: Repository<OrderEntity>
        },
        {
            provide: PRODUCT_SERVICE,
            useValue: {
                getService: jest.fn()
            }
        }
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<OrderEntity>>(OrderEntityRepositoryToken);
  });

  afterAll(async () => {
    await repository.query(`TRUNCATE TABLE "order" CASCADE;`);
  })

  it('should be defined', async () => {
    expect(service).toBeDefined();
  })
});
