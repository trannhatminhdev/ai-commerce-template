import { IsString, IsNotEmpty } from 'class-validator';

export class AddSpecificationDto {
  @IsString()
  @IsNotEmpty()
  specName: string;

  @IsString()
  @IsNotEmpty()
  specValue: string;
}
