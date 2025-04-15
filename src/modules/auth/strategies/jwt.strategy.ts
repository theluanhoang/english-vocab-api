import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service.js';

export interface IPayload {
    sub: string;
    email: string;
    tokenVersion: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: IPayload) {
    const user = await this.userService.getOne({
      where: {
        id: payload.sub,
      },
    });

    if (user?.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Token is expired or invalid');
    }

    return user;
  }
}