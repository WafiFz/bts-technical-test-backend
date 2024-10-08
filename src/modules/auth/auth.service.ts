import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import UserService from '@/modules/user/user.service';
import { DecodedUser } from '@/modules/auth/interfaces/decoded-user.interface';
import { ValidateUserOutput } from '@/modules/auth/interfaces/validate-user-output.interface';
import { LoginPayload } from '@/modules/auth/interfaces/login-payload.interface';
import { ApiConfigService } from '@/shared/services/api-config.service';
import JwtTokenDto from '@/modules/auth/dtos/jwt-token.dto';
import { RolesEnum } from '@/decorators/roles.decorator';

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ApiConfigService,
  ) {}

  public async validateUser(
    username: string,
    password: string,
  ): Promise<null | ValidateUserOutput> {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      return null;
    }

    const passwordCompared = await bcrypt.compare(password, user.password);

    if (!passwordCompared) {
      return null;
    }

    return {
      sub: user.id,
      email: user.email,
      roles: user.roles as RolesEnum[],
    };
  }

  public async login(payload: LoginPayload): Promise<JwtTokenDto> {
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getString('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getNumber('JWT_ACCESS_EXPIRATION_TIME'),
      }),
    ]);

    return {
      token: accessToken,
    };
  }

  public async verifyToken(
    token: string,
    secret: string,
  ): Promise<DecodedUser | null> {
    try {
      const result = await this.jwtService.verifyAsync(token, { secret });

      return result as DecodedUser | null;
    } catch (error) {
      return null;
    }
  }
}
