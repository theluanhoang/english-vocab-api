import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotBlank } from 'src/shared/decorators';

export class LoginDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotBlank()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotBlank()
  password: string;
}