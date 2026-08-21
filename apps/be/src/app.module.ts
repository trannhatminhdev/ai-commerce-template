import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { VouchersModule } from './modules/vouchers/vouchers.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    CoreModule,
    // Shared Module chứa các utility, decorator xài chung
    SharedModule,

    // Cấu hình ServeStatic để phục vụ file tĩnh (ví dụ: ảnh upload)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),

    // Cấu hình Event Emitter cho giao tiếp bất đồng bộ (giúp tách microservices sau này)
    EventEmitterModule.forRoot(),

    // Feature Modules
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    VouchersModule,
    OrdersModule,
    ReviewsModule,
  ],
})
export class AppModule {}
