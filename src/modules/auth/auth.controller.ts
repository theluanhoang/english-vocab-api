import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { LoginDTO } from './dto';
import { Throttle } from '@nestjs/throttler';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { LogoutDTO } from './dto/logout.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiCreatedResponse({
    description: 'User has been successfully created.',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('register')
  @ApiOperation({ summary: 'Register ' })
  register(@Body() dto: CreateUserDTO) {
    return this.authService.register(dto);
  }

  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized: Wrong email or password' })
  @ApiCreatedResponse({
    description: 'Login successfully',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIs...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIs...',
      },
    },
  })
  @Throttle({ short: { limit: 2, ttl: 1000 }, long: { limit: 5, ttl: 60000 } })
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  @ApiCreatedResponse({
    description: 'Access and refresh tokens refreshed successfully',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIs...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIs...',
      },
    },
  })
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access & refresh tokens' })
  refreshToken(@Body() dto: RefreshTokenDTO) {
    return this.authService.refreshToken(dto);
  }

  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  @ApiCreatedResponse({
    description: 'User logged out successfully',
    schema: {
      example: {
        message: 'Logout successful. Refresh token has been deleted.',
      },
    },
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  logout(@Body() dto: LogoutDTO) {
    return this.authService.logout(dto);
  }
}
