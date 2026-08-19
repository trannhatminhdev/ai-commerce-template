import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Cấu hình Swagger
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('AI Commerce API')
      .setDescription('API documentation for AI Commerce Template')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
