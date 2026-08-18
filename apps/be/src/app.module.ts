import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Core Module chứa Config và Database connection
    CoreModule,
    
    // Shared Module chứa các utility, decorator xài chung
    SharedModule,
    
    // Cấu hình Event Emitter cho giao tiếp bất đồng bộ (giúp tách microservices sau này)
    EventEmitterModule.forRoot(),
    
    // Feature Modules
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
