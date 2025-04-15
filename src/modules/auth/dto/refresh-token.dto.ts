import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDTO {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
