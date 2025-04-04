import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { LoginDTO } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @ApiCreatedResponse({
    description: 'Login successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

//   @ApiOkResponse({
//     description: 'Logout successfully',
//   })
//   @ApiBadRequestResponse({
//     description: 'Bad Request.',
//   })
//   @ApiOperation({ summary: 'Logout' })
//   @Post('logout')
//   logout(@Body() dto: LogoutDto) {
//     return this.authService.logout(dto);
//   }

  
}
