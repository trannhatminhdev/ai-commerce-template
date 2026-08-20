import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from '../../application/services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findById(id);
  }
}
