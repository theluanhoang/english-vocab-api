import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString } from "class-validator";
import { IsNotBlank } from "src/shared/decorators";

export class SaveWordDTO {
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

    @ApiProperty({
        example: 'Chắc chắn.'
    })
    @IsNotBlank()
    @IsString()
    meaning: string;

    @ApiProperty({
        example: 'Exercitation reprehenderit aliqua consectetur cupidatat sint magna irure et.'
    })
    @IsNotBlank()
    @IsString()
    definition: string;

    @ApiProperty({
        example: '/cirtif3/'
    })
    @IsNotBlank()
    @IsString()
    pronunciation: string;

    @ApiProperty({
        example: 'verb'
    })
    @IsNotBlank()
    @IsString()
    partOfSpeech: string;

    @ApiProperty({
        example: 'http://example/certify.mp3'
    })
    @IsNotBlank()
    @IsString()
    audio: string;

    @ApiProperty({
        example: 'I certify that true.'
    })
    @IsNotBlank()
    @IsString()
    exampleSentence: string;    
}