import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
  IsPhoneNumber,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsPhoneNumber('VN') // 'VN' để mặc định hỗ trợ format số điện thoại VN, có thể đổi tuỳ use-case
  phoneNumber?: string;
}
