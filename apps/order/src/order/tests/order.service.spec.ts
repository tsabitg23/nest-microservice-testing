import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockOrders, mockProducts } from './order.test.utils';
import { OrderService } from '../order.service';
import { OrderEntity } from '../entities/order.entity';
import { TestDatabaseModule } from '../utils/datasource.provider';
import { PRODUCT_SERVICE } from '../../config/constants';
import { PRODUCT_PACKAGE_NAME } from '@app/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<OrderEntity>;
  let OrderEntityRepositoryToken = getRepositoryToken(OrderEntity);
  let productServiceClient: ClientGrpc;

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
            useFactory: () => ClientProxyFactory.create({
                transport: Transport.GRPC,
                options: {
                  package: PRODUCT_PACKAGE_NAME,
                  protoPath: join(__dirname, '../../product.proto'),
                },
              }),
        }
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<OrderEntity>>(OrderEntityRepositoryToken);
    productServiceClient = module.get<ClientGrpc>(PRODUCT_SERVICE);
  });

  afterAll(async () => {
    await repository.query(`TRUNCATE TABLE "orderProducts" CASCADE;`);
    await repository.query(`TRUNCATE TABLE "order" CASCADE;`);
  })

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should get all orders', async () => {
    await repository.save(mockOrders);
    const result = await service.getAllOrders();
    expect(result.data.length).toEqual(mockOrders.length);  
  });

  it('should create an order', async () => {
    jest.spyOn(service, "getProductDetail").mockResolvedValue(mockProducts[0]);
    jest.spyOn(service, "decreaseStock").mockResolvedValue(true);
    const createOrderParameter = {
        userId: '903b57d3-69c6-4ac5-b3b6-ea05bef2e7bf',
        products: [
            {
                productId: '2dc18a3a-7479-4688-8851-b03e5357c237',
                quantity: 1
            }
        ]
    };
    const testOrder = await service.createOrder(createOrderParameter);
    const expectedResult = {
      orderId: testOrder.orderId,
      status: 201,
      error: ''
    }
    expect(testOrder).toEqual(expectedResult);  
  });

  it('should return error if stock insufficient', async () => {
    const createOrderParameter = {
        userId: '903b57d3-69c6-4ac5-b3b6-ea05bef2e7bf',
        products: [
            {
                productId: '2dc18a3a-7479-4688-8851-b03e5357c237',
                quantity: 100
            }
        ]
    };
    const testOrder = await service.createOrder(createOrderParameter);
    const expectedResult = {
      orderId: "",
      status: 400,
      error: `Insufficient stock for Product ${mockProducts[0].name}`
    }
    expect(testOrder).toEqual(expectedResult);
  })
});
