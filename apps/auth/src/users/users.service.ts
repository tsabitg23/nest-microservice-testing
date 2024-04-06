import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ValidateRequest, ValidateResponse } from '@app/common';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../utils/hashPassword';
import { JwtService } from '@nestjs/jwt';
import appConfig from '../config/appConfig';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}
  async register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    // check if email already exists
    const user = await this.userRepository.findOne({
      where: {
        email: registerRequest.email,
      },
    });

    if(user) {
      throw new BadRequestException('Email already exists');
    }

    // create user
    const newUser = this.userRepository.create(registerRequest);
    newUser.salt = uuidv4();
    newUser.password = await hashPassword(registerRequest.password, newUser.salt);

    await this.userRepository.save(newUser);
    return {
      status: 200,
      error: ''
    }
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    // check if user exist
    const user = await this.userRepository.findOne({
      where: {
        email: loginRequest.email,
      },
    });

    if(!user) {
      throw new NotFoundException('User not found');
    }

    const password = await hashPassword(loginRequest.password, user.salt);
    if(password !== user.password) {
      throw new BadRequestException('Invalid password');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      status: 200,
      error: '',
      token: await this.jwtService.signAsync(payload),
    }
  }

  async validate(validateRequest: ValidateRequest): Promise<ValidateResponse> {
    let userId: string;
    try {
      const payload = await this.jwtService.verifyAsync(
        validateRequest.token,
        {
          secret: appConfig().secret
        }
      );
      userId = payload.sub;
    } catch {
      throw new UnauthorizedException();
    }

    return {
      status: 200,
      error: '',
      userId: userId,
    }
  }
}
