import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { AuthServiceController, AuthServiceControllerMethods, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ValidateRequest, ValidateResponse } from '@app/common';

@Controller()
@AuthServiceControllerMethods()
export class UsersController implements AuthServiceController{
  constructor(private readonly usersService: UsersService) {}

  register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    return this.usersService.register(registerRequest);
  }

  login(loginRequest: LoginRequest): Promise<LoginResponse> {
    return this.usersService.login(loginRequest);
  }

  validate(validateRequest: ValidateRequest): Promise<ValidateResponse> {
    return this.usersService.validate(validateRequest);
  }
}
