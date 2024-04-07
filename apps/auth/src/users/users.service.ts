import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ValidateRequest, ValidateResponse } from '@app/common';
import { BadRequestException, HttpStatus, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../utils/hashPassword';
import { JwtService } from '@nestjs/jwt';
import appConfig from '../config/appConfig';
import { AUTHORIZATION } from '../config/constants';

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
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Email already exists'
      }
    }
    // create user
    try {
      const newUser = this.userRepository.create(registerRequest);
      newUser.salt = uuidv4();
      newUser.password = await hashPassword(registerRequest.password, newUser.salt);
      await this.userRepository.save(newUser);
    } catch(e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal server error'
      }
    }
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
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
        token: null
      }
    }

    const password = await hashPassword(loginRequest.password, user.salt);
    if(password !== user.password) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Invalid password',
        token: null
      }
    }

    const payload = { 
      email: user.email, 
      sub: user.id,
      aud: user.role
    };
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
      // simple authorization
      const scope = validateRequest.scope.split('/')[1];
      if(AUTHORIZATION[scope].indexOf(payload.aud) === -1){
        return {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          userId: ''
        }
      }
      
      userId = payload.sub;
    } catch(e) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: 'Invalid token',
        userId: ''
      }
    }

    return {
      status: 200,
      error: '',
      userId: userId,
    }
  }
}
