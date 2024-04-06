import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/appConfig';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from './config/constants';
import { PRODUCT, PRODUCT_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      envFilePath: ['apps/order/.env'],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_CLIENT: Joi.valid('mysql', 'postgres'),
        DATABASE_HOST: Joi.string(),
        DATABASE_NAME: Joi.string(),
        DATABASE_USERNAME: Joi.string(),
        DATABASE_PASSWORD: Joi.string().empty('').default(''),
        DATABASE_PORT: Joi.number().default(5432),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.name'),
          entities: [],
          synchronize: true,
          autoLoadEntities: true,
          logging: false,
          extra: {
            max: configService.get<number>('database.max_pool') ?? 10,
          },
        };
      },
      inject: [ConfigService],
    }),
    OrderModule,
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: PRODUCT_PACKAGE_NAME,
          protoPath: join(__dirname, '../product.proto')
        }
      }
    ]),
  ],
  controllers: [],
  providers: [],
})
export class OrderServiceModule {}
