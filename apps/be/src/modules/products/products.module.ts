import { Module } from '@nestjs/common';
import { IProductRepository } from './application/interfaces/product-repository.interface';
import { ProductsService } from './application/services/products.service';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductsController } from './presentation/http/products.controller';
import { AdminProductsController } from './presentation/http/admin-products.controller';

@Module({
  controllers: [ProductsController, AdminProductsController],
  providers: [
    ProductsService,
    {
      provide: IProductRepository,
      useClass: ProductRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
