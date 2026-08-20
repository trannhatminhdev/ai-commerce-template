import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from '../../application/services/products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { AddSpecificationDto } from './dtos/add-specification.dto';
import { JwtAuthGuard } from '../../../auth/presentation/http/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/http/guards/roles.guard';
import { Roles } from '../../../auth/presentation/http/decorators/roles.decorator';
import * as fs from 'fs';
import { Role } from '../../../../shared/constants/role.enum';

const uploadPath = './uploads/products';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }

  // --- IMAGES ---

  @Post(':id/images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadPath,
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('isThumbnail') isThumbnail?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const imageUrl = `/uploads/products/${file.filename}`;
    const isThumb = isThumbnail === 'true';

    return this.productsService.addImage(id, {
      imageUrl,
      isThumbnail: isThumb,
    });
  }

  @Patch(':id/images/:imageId/thumbnail')
  setThumbnail(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.productsService.setThumbnail(id, imageId);
  }

  @Delete(':id/images/:imageId')
  removeImage(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.productsService.deleteImage(id, imageId);
  }

  // --- SPECIFICATIONS ---

  @Post(':id/specifications')
  addSpecification(
    @Param('id', ParseIntPipe) id: number,
    @Body() addSpecificationDto: AddSpecificationDto,
  ) {
    return this.productsService.addSpecification(id, addSpecificationDto);
  }

  @Delete(':id/specifications/:specId')
  removeSpecification(
    @Param('id', ParseIntPipe) id: number,
    @Param('specId', ParseIntPipe) specId: number,
  ) {
    return this.productsService.deleteSpecification(id, specId);
  }
}
