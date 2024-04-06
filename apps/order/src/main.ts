import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ORDER_PACKAGE_NAME } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../order.proto'),
        package: ORDER_PACKAGE_NAME
      }
    }
  );
  await app.listen();
}
bootstrap();
