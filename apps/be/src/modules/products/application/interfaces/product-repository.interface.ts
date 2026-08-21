import {
  Product,
  ProductImage,
  ProductSpecification,
  Prisma,
} from '@prisma/client';

export const IProductRepository = Symbol('IProductRepository');

export interface IProductRepository {
  createProduct(data: Prisma.ProductUncheckedCreateInput): Promise<Product>;
  findAllProducts(params?: {
    skip?: number;
    take?: number;
    search?: string;
    categoryId?: number;
  }): Promise<{ data: Product[]; total: number }>;
  findProductById(id: number): Promise<Product | null>;
  updateProduct(
    id: number,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Images
  addImage(
    productId: number,
    data: { imageUrl: string; isThumbnail?: boolean },
  ): Promise<ProductImage>;
  deleteImage(imageId: number): Promise<void>;
  setThumbnail(productId: number, imageId: number): Promise<void>;
  findImagesByProductId(productId: number): Promise<ProductImage[]>;

  // Specifications
  addSpecification(
    productId: number,
    data: { specName: string; specValue: string },
  ): Promise<ProductSpecification>;
  deleteSpecification(specId: number): Promise<void>;
}
