import { IsInt, Min, IsOptional, IsString } from 'class-validator';

export class UpdateGoodDeedDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsInt()
  @Min(1)
  readonly id: number;
}
