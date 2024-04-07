import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import appConfig from '../config/appConfig';
import { ProductsModule } from '../products/products.module';
import { ProductEntity } from '../products/products.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
            envFilePath: ['apps/product/.env.test'],
        }),
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.name'),
                entities: [ProductEntity],
                synchronize: true,
                migrationsTableName: 'migrations',
            }),
            inject: [ConfigService],
        }),
        ProductsModule,
    ],
})
export class TestDatabaseModule { }