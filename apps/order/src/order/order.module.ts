import 'dotenv/config';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderProductsEntity } from './entities/orderProducts.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from '../config/constants';
import { PRODUCT_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    TypeOrmModule.forFeature([OrderProductsEntity]),
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: PRODUCT_PACKAGE_NAME,
          protoPath: join(__dirname, '../product.proto'),
          url: process.env.PRODUCT_SERVICE_URL || '0.0.0.0:5001'
        }
      }
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
