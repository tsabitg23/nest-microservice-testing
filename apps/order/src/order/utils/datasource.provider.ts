import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import appConfig from '../../config/appConfig';
import { OrderModule } from '../order.module';
import { OrderEntity } from '../entities/order.entity';
import { OrderProductsEntity } from '../entities/orderProducts.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
            envFilePath: ['apps/order/.env.test'],
        }),
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.name'),
                entities: [OrderEntity, OrderProductsEntity],
                synchronize: true,
                migrationsTableName: 'migrations',
            }),
            inject: [ConfigService],
        }),
        OrderModule,
    ],
})
export class TestDatabaseModule { }