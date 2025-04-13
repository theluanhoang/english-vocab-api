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
        const trimmedWord = (params.value as string).trim();
        const res = trimmedWord.toLowerCase();
        console.log("RES:::", res);
        
        return res;
    })
    word: string;
}