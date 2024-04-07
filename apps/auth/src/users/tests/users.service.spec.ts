import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { TestDatabaseModule } from '../../utils/datasource.provider';
import { hashPassword } from '../../utils/hashPassword';
import { HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<UserEntity>;
  let mockUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: 'admin'
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule
      ],
      providers: [
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository<UserEntity>
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  afterAll(async () => {
    await repository.query(`TRUNCATE TABLE "user" CASCADE;`);
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user', async () => {
    await service.register(mockUser);
    const data = await repository.findOne({ where: {email: mockUser.email}});
    expect(data).toBeDefined();
    const password = await hashPassword(mockUser.password, data.salt);
    expect(data.email).toEqual(mockUser.email);
    expect(data.password).toEqual(password);
  });

  it('should throw error when register with existing email', async () => {
    const result = await service.register(mockUser);
    expect(result.error).toEqual('Email already exists');
  });

  it('should login a user', async () => {
    const data = await service.login({email: mockUser.email, password: mockUser.password});
    expect(data.token).toBeDefined();
  });

  it('login > wrong password', async () => {
    const loginResult = await service.login({email: mockUser.email, password: 'wrongpassword'});
    expect(loginResult.error).toEqual('Invalid password');
    expect(loginResult.status).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('login > wrong email', async () => {
    const loginResult = await service.login({email: 'wrongemail', password: mockUser.password});
    expect(loginResult.error).toEqual('User not found');
    expect(loginResult.status).toEqual(HttpStatus.NOT_FOUND);
  });

  it('should validate correct token', async () => {
    const loginResult = await service.login({email: mockUser.email, password: mockUser.password});
    const validateResult = await service.validate({token: loginResult.token, scope: '/product/'});
    expect(validateResult.status).toEqual(200);
  })

  it('should invalidate when request with wrong token', async () => {
    const falseToken = 'wrongtoken';
    const validateResult = await service.validate({token: falseToken, scope: '/product/'});
    expect(validateResult.status).toEqual(401);
  });
});
