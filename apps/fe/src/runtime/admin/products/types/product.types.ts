export interface ProductImage {
  id?: number;
  imageUrl: string;
  isThumbnail: boolean;
}

export interface ProductSpecification {
  id?: number;
  specName: string;
  specValue: string;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  description?: string | null;
  images?: ProductImage[];
  specifications?: ProductSpecification[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateProductInput {
  categoryId: number;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  description?: string;
  images?: ProductImage[];
  specifications?: ProductSpecification[];
}

export interface UpdateProductInput {
  categoryId?: number;
  name?: string;
  price?: number;
  originalPrice?: number;
  stock?: number;
  description?: string;
  images?: ProductImage[];
  specifications?: ProductSpecification[];
}
