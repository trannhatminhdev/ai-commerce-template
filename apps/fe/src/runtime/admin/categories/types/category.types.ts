export interface Category {
  id: number;
  name: string;
  parentId?: number | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateCategoryInput {
  name: string;
  parentId?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  parentId?: number;
}
