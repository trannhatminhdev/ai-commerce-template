import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyVoucherDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
