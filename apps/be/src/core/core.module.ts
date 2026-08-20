import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    // Cấu hình biến môi trường toàn cục
    ConfigModule.forRoot({
      isGlobal: true, // Không cần import lại ở các module khác
      envFilePath: ['.env', '../../.env'],
    }),
    DatabaseModule, // Module quản lý kết nối DB
  ],
})
export class CoreModule {}
