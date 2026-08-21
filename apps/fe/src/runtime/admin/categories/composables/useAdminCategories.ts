import { ref, computed } from 'vue';
import { useState } from '#app';
import { useAdminAuth } from '../../auth/composables/useAdminAuth';
import { adminCategoriesService } from '../services/admin-categories.service';
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../types/category.types';

export function useAdminCategories() {
  const { accessToken } = useAdminAuth();

  const categories = useState<Category[]>('admin_categories_list', () => []);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);
  const successMessage = ref<string | null>(null);
  const searchQuery = ref('');

  /**
   * Danh sách danh mục đã lọc theo từ khóa tìm kiếm (không phân biệt hoa thường)
   */
  const filteredCategories = computed(() => {
    if (!searchQuery.value.trim()) {
      return categories.value;
    }
    const query = searchQuery.value.toLowerCase().trim();
    return categories.value.filter((cat) =>
      cat.name.toLowerCase().includes(query),
    );
  });

  const clearMessages = () => {
    errorMessage.value = null;
    successMessage.value = null;
  };

  /**
   * Tải danh sách danh mục từ backend
   */
  const fetchCategories = async (): Promise<Category[]> => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const data = await adminCategoriesService.getCategories(
        accessToken.value || undefined,
      );
      categories.value = data;
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        errorMessage.value = err.message;
      } else {
        errorMessage.value = 'Không thể tải danh sách danh mục.';
      }
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Lấy chi tiết danh mục theo ID
   */
  const getCategoryById = async (id: number): Promise<Category | null> => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const data = await adminCategoriesService.getCategoryById(
        id,
        accessToken.value || undefined,
      );
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        errorMessage.value = err.message;
      } else {
        errorMessage.value = 'Không thể tải thông tin danh mục.';
      }
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Tạo danh mục mới
   */
  const createCategory = async (
    input: CreateCategoryInput,
  ): Promise<Category | null> => {
    if (!input.name || !input.name.trim()) {
      errorMessage.value = 'Tên danh mục không được để trống.';
      return null;
    }

    isSubmitting.value = true;
    clearMessages();

    try {
      const newCategory = await adminCategoriesService.createCategory(
        { name: input.name.trim() },
        accessToken.value || undefined,
      );
      categories.value = [newCategory, ...categories.value];
      successMessage.value = 'Thêm danh mục mới thành công.';
      return newCategory;
    } catch (err: unknown) {
      if (err instanceof Error) {
        errorMessage.value = err.message;
      } else {
        errorMessage.value = 'Không thể tạo danh mục mới.';
      }
      return null;
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * Cập nhật thông tin danh mục
   */
  const updateCategory = async (
    id: number,
    input: UpdateCategoryInput,
  ): Promise<Category | null> => {
    if (input.name !== undefined && !input.name.trim()) {
      errorMessage.value = 'Tên danh mục không được để trống.';
      return null;
    }

    isSubmitting.value = true;
    clearMessages();

    try {
      const payload: UpdateCategoryInput = {};
      if (input.name !== undefined) {
        payload.name = input.name.trim();
      }

      const updated = await adminCategoriesService.updateCategory(
        id,
        payload,
        accessToken.value || undefined,
      );

      const index = categories.value.findIndex((cat) => cat.id === id);
      if (index !== -1) {
        categories.value[index] = updated;
      }

      successMessage.value = 'Cập nhật danh mục thành công.';
      return updated;
    } catch (err: unknown) {
      if (err instanceof Error) {
        errorMessage.value = err.message;
      } else {
        errorMessage.value = 'Không thể cập nhật danh mục.';
      }
      return null;
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * Xóa danh mục
   */
  const deleteCategory = async (id: number): Promise<boolean> => {
    isSubmitting.value = true;
    clearMessages();

    try {
      await adminCategoriesService.deleteCategory(
        id,
        accessToken.value || undefined,
      );
      categories.value = categories.value.filter((cat) => cat.id !== id);
      successMessage.value = 'Xóa danh mục thành công.';
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        errorMessage.value = err.message;
      } else {
        errorMessage.value = 'Không thể xóa danh mục.';
      }
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    categories,
    filteredCategories,
    searchQuery,
    isLoading,
    isSubmitting,
    errorMessage,
    successMessage,
    clearMessages,
    fetchCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
