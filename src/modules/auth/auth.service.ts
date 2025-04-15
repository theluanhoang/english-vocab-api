import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { EMessageError } from 'src/shared/common/error.message';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { getRefreshTokenKey } from 'src/utils';
import { ConfigService } from '@nestjs/config';
import { LoginDTO } from './dto/login.dto';
import { LogoutDTO } from './dto/logout.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { IPayload } from './strategies';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly config: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.getOneOrThrow({
      where: { email },
    });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException(EMessageError.PASSWORD_NOT_MATCH);
    }

    return user;
  }

  async login(loginDTO: LoginDTO) {
    const user = await this.usersService.comparePassword(loginDTO);

    const accessToken = await this.signToken(user.id, user.email, user.tokenVersion);
    const refreshToken = await this.signRefreshToken(user.id, user.email, user.tokenVersion);

    await this.cacheManager.set(getRefreshTokenKey(user.id), refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(registerDTO: CreateUserDTO) {
    const existingUser = await this.usersService.getOne({
      where: { email: registerDTO.email },
    });

    if (existingUser) {
      throw new BadRequestException(EMessageError.EMAIL_IS_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(registerDTO.password, 10);
    await this.usersService.create({
      email: registerDTO.email,
      password: hashedPassword,
    });

    return {
      message: 'Registration has succeeded',
    };
  }

  async signToken(userId: string, email: string, tokenVersion: number) {
    const payload: IPayload = { sub: userId, email, tokenVersion };

    return this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('EXP_ACCESS_TOKEN'),
    });
  }

  async signRefreshToken(userId: string, email: string, tokenVersion: number) {
    const payload: IPayload = { sub: userId, email, tokenVersion };

    return this.jwtService.signAsync(payload, {
      expiresIn: this.config.get('EXP_REFRESH_TOKEN'),
      secret: this.config.get('REFRESH_SECRET'),
    });
  }

  async refreshToken(dto: RefreshTokenDTO) {
    try {
      const payload = await this.jwtService.verifyAsync<IPayload>(dto.refreshToken, {
        secret: this.config.get('REFRESH_SECRET'),
      });

      const key = getRefreshTokenKey(payload.sub);
      const cachedRefreshToken = await this.cacheManager.get<string>(key);

      if (cachedRefreshToken !== dto.refreshToken) {
        throw new UnauthorizedException('Refresh token mismatch or expired');
      }

      const user = await this.usersService.getOneOrThrow({ where: { id: payload.sub } });

      if (user.tokenVersion !== payload.tokenVersion) {
        throw new UnauthorizedException('Token has been revoked.');
      }

      const accessToken = await this.signToken(user.id, user.email, user.tokenVersion);
      const newRefreshToken = await this.signRefreshToken(user.id, user.email, user.tokenVersion);

      await this.cacheManager.set(key, newRefreshToken);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(dto: LogoutDTO) {
    try {
      const payload = await this.jwtService.verifyAsync<IPayload>(dto.refreshToken, {
        secret: this.config.get('REFRESH_SECRET'),
      });

      const key = getRefreshTokenKey(payload.sub);
      const cached = await this.cacheManager.get<string>(key);

      if (!cached || cached !== dto.refreshToken) {
        throw new UnauthorizedException('Refresh token is invalid or already expired');
      }

      await this.cacheManager.del(key);

      const user = await this.usersService.getOneOrThrow({ where: { id: payload.sub } });
      
      await this.usersService.update(payload.sub, {
        tokenVersion: user.tokenVersion + 1,
      });

      return {
        message: 'Logout successful. Token has been revoked.',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
