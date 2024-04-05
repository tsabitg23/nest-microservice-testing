import { NestFactory } from "@nestjs/core";
import { ProductModule } from './product.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PRODUCT } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProductModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../product.proto'),
        package: PRODUCT,
      },
    },
  );

  await app.listen();
}
bootstrap();
