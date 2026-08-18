import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình Global Prefix
  app.setGlobalPrefix('api/v1');

  // Bật CORS
  app.enableCors();

  // Cấu hình Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các field không có trong DTO
      transform: true, // Tự động transform payload thành DTO object
      forbidNonWhitelisted: true, // Throw error nếu có field lạ
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
