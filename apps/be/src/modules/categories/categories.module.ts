import { Module } from '@nestjs/common';
import { CategoriesService } from './application/services/categories.service';
import { CategoriesRepository } from './infrastructure/repositories/categories.repository';
import { CategoriesController } from './presentation/http/categories.controller';
import { ICategoryRepository } from './application/interfaces/category-repository.interface';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: ICategoryRepository,
      useClass: CategoriesRepository,
    },
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
