import 'dotenv/config';
import { NestFactory } from "@nestjs/core";
import { ProductModule } from './product.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PRODUCT_PACKAGE_NAME } from '@app/common';

async function bootstrap() {
  const url = process.env.PRODUCT_SERVICE_URL || '0.0.0.0:5001';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProductModule,
    {
      transport: Transport.GRPC,
      options: {
        package: PRODUCT_PACKAGE_NAME,
        protoPath: join(__dirname, '../product.proto'),
        url
      },
    },
  );
  
  await app.listen();
  console.log('Running on ' + url);
}
bootstrap();
