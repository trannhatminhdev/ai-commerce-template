import { IsNotEmpty, IsString, IsNumber, IsEnum, Min } from 'class-validator';

export class CreateVoucherDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsNotEmpty()
  @IsEnum(['PERCENT', 'FIXED'])
  discountType: string;
}
