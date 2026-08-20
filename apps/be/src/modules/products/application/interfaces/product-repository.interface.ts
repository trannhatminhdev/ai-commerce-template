export const IProductRepository = Symbol('IProductRepository');

export interface IProductRepository {
  createProduct(data: any): Promise<any>;
  findAllProducts(params?: {
    skip?: number;
    take?: number;
    search?: string;
    categoryId?: number;
  }): Promise<any[]>;
  findProductById(id: number): Promise<any>;
  updateProduct(id: number, data: any): Promise<any>;
  deleteProduct(id: number): Promise<void>;
  
  // Images
  addImage(productId: number, data: { imageUrl: string; isThumbnail?: boolean }): Promise<any>;
  deleteImage(imageId: number): Promise<void>;
  setThumbnail(productId: number, imageId: number): Promise<void>;
  findImagesByProductId(productId: number): Promise<any[]>;
  
  // Specifications
  addSpecification(productId: number, data: { specName: string; specValue: string }): Promise<any>;
  deleteSpecification(specId: number): Promise<void>;
}
