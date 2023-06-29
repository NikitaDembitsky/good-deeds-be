import { IsOptional, IsInt, Min } from 'class-validator';

export class FindAllByUserIdDto {
  @IsInt()
  @Min(1)
  readonly size: number;

  @IsInt()
  @Min(1)
  readonly page: number;
}
