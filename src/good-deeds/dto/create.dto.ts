import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGoodDeedDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
