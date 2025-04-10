import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString } from "class-validator";
import { IsNotBlank } from "src/shared/decorators";

export class NoteWordDTO {
    @ApiProperty({
        example: 'certify'
    })
    @IsNotBlank()
    @IsString()
    @Transform((params) => {
        params.value = (params.value as string).toLowerCase();
        return params.value;
    })
    word: string;
}