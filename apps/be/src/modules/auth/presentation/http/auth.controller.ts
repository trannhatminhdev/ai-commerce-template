import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto } from './dtos/login.dto';

// Lớp Presentation (Controller) chỉ nhận Request, xác thực đầu vào (ValidationPipe/DTO)
// và gọi đến Application Layer (Service) để xử lý logic, không chứa business logic ở đây.
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('ping')
  ping() {
    return {
      message: this.authService.ping(),
      timestamp: new Date().toISOString(),
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // DTO đã được validate tự động bởi Global Validation Pipe trong main.ts
    const result = await this.authService.login(loginDto.email);
    return {
      success: true,
      data: result,
    };
  }
}
