import WrapResponseInterceptor from '@/interceptors/wrap-response.interceptor';
import AuthService from '@/modules/auth/auth.service';
import JwtTokenDto from '@/modules/auth/dtos/jwt-token.dto';
import LoginDto from '@/modules/auth/dtos/login.dto';
import SignupDto from '@/modules/auth/dtos/signup.dto';
import UserService from '@/modules/user/user.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiTags
} from '@nestjs/swagger';
import { User } from '@prisma/client';

@ApiTags('Auth')
@ApiExtraModels(JwtTokenDto)
@UseInterceptors(WrapResponseInterceptor)
@Controller('')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<JwtTokenDto> {
    const validatedUser = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (validatedUser === null) {
      throw new UnauthorizedException('Incorrect login or password');
    }

    return this.authService.login({
      sub: validatedUser.sub,
      email: validatedUser.email,
      roles: validatedUser.roles,
    });
  }

  @ApiBody({ type: SignupDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signup(@Body() user: SignupDto): Promise<User> {
    return this.userService.create(user);
  }
}
