import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { LoginDTO } from './dto';
import { UsersService } from '../users/users.service';
import { EMessageError } from 'src/shared/common/error.message';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { getRefreshTokenKey } from 'src/utils';
import { ConfigService } from '@nestjs/config';

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
        where: {
            email
        }
    });

    const isMatch: boolean = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      throw new BadRequestException(EMessageError.PASSWORD_NOT_MATCH);
    }

    return user;
  }

  async login(loginDTO: LoginDTO) {
    const user = await this.usersService.comparePassword(loginDTO);

    const accessToken = await this.signToken(user.id, user.email);
    const refreshToken = await this.signRefreshToken(user.id, user.email);

    await this.cacheManager.set(getRefreshTokenKey(user.id), refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(registerDTO: CreateUserDTO) {
    const existingUser = await this.usersService.getOne({
        where: {
            email: registerDTO.email
        }
    });

    if (existingUser) {
      throw new BadRequestException(EMessageError.EMAIL_IS_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(registerDTO.password, 10);

    const newUser = { email: registerDTO.email, password: hashedPassword };
    
    await this.usersService.create(newUser);
    
    return {
        message: 'Registration has succeeded'
    };
  }

  async signTokenVerify(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '1day',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async signToken(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('EXP_ACCESS_TOKEN'),
    });
  }

  async signRefreshToken(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: this.config.get('EXP_REFRESH_TOKEN'),
      secret: this.config.get('REFRESH_SECRET'),
    });
  }

//   async logout(dto: LogoutDto) {
//     try {
//       const payload = this.jwtService.verify(dto.refreshToken, {
//         secret: this.cacheManager.get('REFRESH_SECRET'),
//       });

//       const user = await this.usersService.getOneOrThrow({
//         where: {
//           id: payload.sub,
//         },
//       });

//       const savedToken = await this.cacheManager.get(
//         getRefreshTokenKey(user.id),
//       );

//       if (savedToken !== dto.refreshToken) {
//         throw new UnauthorizedException();
//       }
//       await this.cacheManager.del(getRefreshTokenKey(user.id));
//     } catch (error) {
//       throw new UnauthorizedException('Invalid or expired refresh token');
//     }
//   }
}