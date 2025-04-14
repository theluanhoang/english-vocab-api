import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class GetCollectionDTO {
  @IsOptional()
  @IsUUID(4)
  collectionId?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  offset?: number;
}
