import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IProductRepository } from '../interfaces/product-repository.interface';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async createProduct(data: any) {
    return this.productRepository.createProduct(data);
  }

  async findAllProducts(params?: any) {
    return this.productRepository.findAllProducts(params);
  }

  async findProductById(id: number) {
    const product = await this.productRepository.findProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateProduct(id: number, data: any) {
    await this.findProductById(id);
    return this.productRepository.updateProduct(id, data);
  }

  async deleteProduct(id: number) {
    await this.findProductById(id);
    return this.productRepository.deleteProduct(id);
  }

  async addImage(productId: number, data: { imageUrl: string; isThumbnail?: boolean }) {
    await this.findProductById(productId);
    
    // Logic: Nếu chưa có thumbnail nào hoặc data request muốn set làm thumbnail
    const currentImages = await this.productRepository.findImagesByProductId(productId);
    
    let isThumbnail = data.isThumbnail || false;
    
    if (currentImages.length === 0) {
      // Ảnh đầu tiên mặc định là thumbnail
      isThumbnail = true;
    }

    if (isThumbnail && currentImages.length > 0) {
      // Nếu set ảnh này làm thumbnail, cần xoá cờ thumbnail của các ảnh khác
      const currentThumbnail = currentImages.find(img => img.isThumbnail);
      if (currentThumbnail) {
        // Có thể cần 1 method setThumbnail để đổi cờ
        // Hoặc updateImage (nhưng interface chưa có)
        // Hiện tại ta có setThumbnail(productId, imageId) trong interface
        // Sẽ được gọi sau khi tạo ảnh mới, hoặc Repository tự lo
      }
    }

    const newImage = await this.productRepository.addImage(productId, { ...data, isThumbnail });
    
    if (isThumbnail && currentImages.length > 0) {
      await this.productRepository.setThumbnail(productId, newImage.id);
    }
    
    return newImage;
  }

  async deleteImage(productId: number, imageId: number) {
    await this.findProductById(productId); // Ensure product exists
    return this.productRepository.deleteImage(imageId);
  }

  async setThumbnail(productId: number, imageId: number) {
    await this.findProductById(productId);
    return this.productRepository.setThumbnail(productId, imageId);
  }

  async addSpecification(productId: number, data: { specName: string; specValue: string }) {
    await this.findProductById(productId);
    return this.productRepository.addSpecification(productId, data);
  }

  async deleteSpecification(productId: number, specId: number) {
    await this.findProductById(productId);
    return this.productRepository.deleteSpecification(specId);
  }
}
