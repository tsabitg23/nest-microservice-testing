import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ORDER } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../order.proto'),
        package: ORDER
      }
    }
  );
  await app.listen();
}
bootstrap();
