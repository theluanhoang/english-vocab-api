import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { IsNotBlank } from "src/shared/decorators";
import { ECollectionType } from "../collections.enum";

export class CreateCollectionDTO {
    @ApiProperty({
        description: "Create a collection that contains all variants of the word."
    })
    @IsNotBlank()
    @IsString()
    name: string;

    @ApiProperty({
        example: ECollectionType.FORM
    })
    @IsNotBlank()
    @IsEnum(ECollectionType)
    type: ECollectionType;
}