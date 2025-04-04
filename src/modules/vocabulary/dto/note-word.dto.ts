import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsNotBlank } from "src/shared/decorators";

export class NoteWordDTO {
    @ApiProperty()
    @IsNotBlank()
    @IsString()
    word: string;
}