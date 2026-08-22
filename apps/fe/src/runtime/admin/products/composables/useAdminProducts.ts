import { ref, computed } from 'vue';
import { useState, useRuntimeConfig } from '#app';
import { useToast } from '#fe/core/composables/useToast';
import { useAdminAuth } from '#fe/admin/auth/composables/useAdminAuth';
import { adminProductsService } from '#fe/admin/products/services/admin-products.service';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from '#fe/admin/products/types/product.types';

export function useAdminProducts() {
  const toast = useToast();
  const { accessToken } = useAdminAuth();

  const products = useState<Product[]>('admin_products_list', () => []);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalItems = ref(0);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const searchQuery = ref('');

  const filteredProducts = computed(() => products.value);
  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value),
  );

  const fetchProducts = async (): Promise<Product[]> => {
    isLoading.value = true;

    try {
      const skip = (currentPage.value - 1) * itemsPerPage.value;
      const res = await adminProductsService.getProducts(
        accessToken.value || undefined,
        skip,
        itemsPerPage.value,
        searchQuery.value,
      );
      products.value = res.data;
      totalItems.value = res.total;
      return res.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Không thể tải danh sách sản phẩm.');
      }
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const getProductById = async (id: number): Promise<Product | null> => {
    isLoading.value = true;

    try {
      const data = await adminProductsService.getProductById(
        id,
        accessToken.value || undefined,
      );
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Không thể tải thông tin sản phẩm.');
      }
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const createProduct = async (
    input: CreateProductInput,
  ): Promise<Product | null> => {
    if (!input.name || !input.name.trim()) {
      toast.error('Tên sản phẩm không được để trống.');
      return null;
    }

    isSubmitting.value = true;

    try {
      const newProduct = await adminProductsService.createProduct(
        input,
        accessToken.value || undefined,
      );
      products.value = [newProduct, ...products.value];
      totalItems.value++;

      // Nếu vượt quá số lượng item/trang, ta bỏ bớt phần tử cuối
      if (products.value.length > itemsPerPage.value) {
        products.value.pop();
      }

      toast.success('Tạo sản phẩm thành công.');
      return newProduct;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Có lỗi xảy ra khi tạo sản phẩm.');
      }
      return null;
    } finally {
      isSubmitting.value = false;
    }
  };

  const updateProduct = async (
    id: number,
    input: UpdateProductInput,
  ): Promise<Product | null> => {
    isSubmitting.value = true;

    try {
      const updatedProduct = await adminProductsService.updateProduct(
        id,
        input,
        accessToken.value || undefined,
      );
      const index = products.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.value[index] = updatedProduct;
      }
      toast.success('Cập nhật sản phẩm thành công.');
      return updatedProduct;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật sản phẩm.');
      }
      return null;
    } finally {
      isSubmitting.value = false;
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    isSubmitting.value = true;

    try {
      await adminProductsService.deleteProduct(
        id,
        accessToken.value || undefined,
      );
      products.value = products.value.filter((p) => p.id !== id);
      if (totalItems.value > 0) totalItems.value--;
      toast.success('Xóa sản phẩm thành công.');

      // Tự động fetch lại nếu số lượng item trên trang hiện tại bằng 0
      // (ví dụ xóa sản phẩm duy nhất ở trang cuối)
      if (products.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
        fetchProducts();
      } else if (
        products.value.length < itemsPerPage.value &&
        totalItems.value >= itemsPerPage.value
      ) {
        // Cập nhật lại danh sách cho đầy đủ page
        fetchProducts();
      }

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Có lỗi xảy ra khi xóa sản phẩm.');
      }
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  const uploadImage = async (id: number, file: File, isThumbnail: boolean) => {
    isSubmitting.value = true;
    try {
      const config = useRuntimeConfig();
      const baseUrl =
        (config.public?.apiBase as string) || 'http://localhost:3000/api/v1';
      await adminProductsService.uploadImage(
        id,
        file,
        isThumbnail,
        accessToken.value || undefined,
        baseUrl,
      );
      return true;
    } catch {
      toast.error('Lỗi khi upload ảnh.');
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  const deleteImage = async (id: number, imageId: number) => {
    isSubmitting.value = true;
    try {
      await adminProductsService.deleteImage(
        id,
        imageId,
        accessToken.value || undefined,
      );
      return true;
    } catch {
      toast.error('Lỗi khi xóa ảnh.');
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  const setThumbnail = async (id: number, imageId: number) => {
    isSubmitting.value = true;
    try {
      await adminProductsService.setThumbnail(
        id,
        imageId,
        accessToken.value || undefined,
      );
      return true;
    } catch {
      toast.error('Lỗi khi set ảnh bìa.');
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  const addSpecification = async (
    id: number,
    specName: string,
    specValue: string,
  ) => {
    isSubmitting.value = true;
    try {
      await adminProductsService.addSpecification(
        id,
        { specName, specValue },
        accessToken.value || undefined,
      );
      return true;
    } catch {
      toast.error('Lỗi khi thêm thuộc tính.');
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  const deleteSpecification = async (id: number, specId: number) => {
    isSubmitting.value = true;
    try {
      await adminProductsService.deleteSpecification(
        id,
        specId,
        accessToken.value || undefined,
      );
      return true;
    } catch {
      toast.error('Lỗi khi xóa thuộc tính.');
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    products,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    isLoading,
    isSubmitting,
    searchQuery,
    filteredProducts,
    fetchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    deleteImage,
    setThumbnail,
    addSpecification,
    deleteSpecification,
  };
}
