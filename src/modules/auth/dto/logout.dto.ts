import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsNotBlank } from "src/shared/decorators";

export class LogoutDTO {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
    @IsString()
    @IsNotBlank()
    refreshToken: string;
}