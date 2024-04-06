import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import appConfig from '../config/appConfig';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      secret: appConfig().secret,
      signOptions: { expiresIn: '500s' },
    })
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
