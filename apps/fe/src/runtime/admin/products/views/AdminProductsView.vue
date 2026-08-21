<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-[#003D9B]">
          Quản lý sản phẩm
        </h1>
        <p class="mt-1 text-sm text-[#5C5F60]">
          Danh sách và thông tin các sản phẩm trên hệ thống.
        </p>
      </div>

      <NuxtLink
        to="/admin/products/create"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003D9B] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#002f78] focus:outline-none focus:ring-2 focus:ring-[#003D9B] focus:ring-offset-2"
      >
        <span>Thêm sản phẩm</span>
      </NuxtLink>
    </div>

    <!-- Feedback Alerts -->
    <div
      v-if="successMessage"
      class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex justify-between"
    >
      <span>{{ successMessage }}</span>
      <button @click="clearMessages">x</button>
    </div>
    <div
      v-if="errorMessage"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex justify-between"
    >
      <span>{{ errorMessage }}</span>
      <button @click="clearMessages">x</button>
    </div>

    <!-- Search -->
    <div
      class="flex flex-col gap-3 rounded-xl border border-[#C3C6D6] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm sản phẩm theo tên..."
        class="w-full max-w-md rounded-lg border border-[#C3C6D6] bg-white py-2 px-4 text-sm focus:border-[#003D9B] focus:outline-none focus:ring-1 focus:ring-[#003D9B]"
      />
      <div class="text-xs font-semibold text-[#434654]">
        <span class="rounded-full bg-[#DAE2FF] px-3 py-1 text-[#0040A2]"
          >Tổng cộng: {{ totalItems }} sản phẩm</span
        >
      </div>
    </div>

    <!-- Table Section -->
    <div
      class="overflow-hidden rounded-xl border border-[#C3C6D6] bg-white shadow-xs"
    >
      <div v-if="isLoading" class="p-12 text-center text-sm text-[#5C5F60]">
        Đang tải...
      </div>
      <div
        v-else-if="filteredProducts.length === 0"
        class="p-12 text-center text-sm text-[#5C5F60]"
      >
        Không có dữ liệu.
      </div>
      <table v-else class="w-full text-left text-sm text-[#434654]">
        <thead class="bg-[#F8F9FA] text-xs uppercase text-[#737685]">
          <tr>
            <th class="px-6 py-4 font-semibold">Hình ảnh</th>
            <th class="px-6 py-4 font-semibold">Tên sản phẩm</th>
            <th class="px-6 py-4 font-semibold">Danh mục</th>
            <th class="px-6 py-4 font-semibold">Giá</th>
            <th class="px-6 py-4 font-semibold">Kho</th>
            <th class="px-6 py-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E6E8F0]">
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
            class="hover:bg-[#F8F9FA]"
          >
            <td class="px-6 py-4 font-medium">
              <img
                v-if="product.images && product.images.length > 0"
                :src="
                  useImageUrl(
                    product.images.find((img) => img.isThumbnail)?.imageUrl ||
                      product.images[0]?.imageUrl,
                  )
                "
                class="w-12 h-12 object-cover rounded"
              />
              <div
                v-else
                class="w-12 h-12 bg-slate-200 rounded flex items-center justify-center text-xs text-slate-500"
              >
                No Img
              </div>
            </td>
            <td class="px-6 py-4 font-semibold text-[#1A1C1C]">
              {{ product.name }}
            </td>
            <td class="px-6 py-4">{{ getCategoryName(product.categoryId) }}</td>
            <td class="px-6 py-4 text-red-600 font-semibold">
              {{ formatCurrency(product.price) }}
            </td>
            <td class="px-6 py-4">{{ product.stock }}</td>
            <td class="px-6 py-4 text-right">
              <NuxtLink
                :to="`/admin/products/${product.id}`"
                class="text-[#0040A2] hover:underline mr-3"
                >Sửa</NuxtLink
              >
              <button
                class="text-red-600 hover:underline"
                @click="openDeleteModal(product)"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between border-t border-[#C3C6D6] bg-white px-4 py-3 sm:px-6 rounded-xl shadow-xs mt-4"
    >
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          :disabled="currentPage === 1"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          @click="prevPage"
        >
          Trang trước
        </button>
        <button
          :disabled="currentPage === totalPages"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          @click="nextPage"
        >
          Trang sau
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Hiển thị từ
            <span class="font-medium">{{
              (currentPage - 1) * itemsPerPage + 1
            }}</span>
            đến
            <span class="font-medium">{{
              Math.min(currentPage * itemsPerPage, totalItems)
            }}</span>
            trong số
            <span class="font-medium">{{ totalItems }}</span>
            sản phẩm
          </p>
        </div>
        <div>
          <nav
            class="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 focus:z-20 focus:outline-offset-0"
              @click="prevPage"
            >
              <span class="sr-only">Trang trước</span>
              <svg
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              :class="[
                page === currentPage
                  ? 'relative z-10 inline-flex items-center bg-[#003D9B] px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003D9B]'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
              ]"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 focus:z-20 focus:outline-offset-0"
              @click="nextPage"
            >
              <span class="sr-only">Trang sau</span>
              <svg
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="isDeleteModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-slate-900/50"
        @click="closeDeleteModal"
      ></div>
      <div
        class="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl text-center"
      >
        <h3 class="text-lg font-bold text-red-600 mb-2">Xác nhận xóa</h3>
        <p class="mb-6">Bạn có chắc muốn xóa "{{ deletingProduct?.name }}"?</p>
        <div class="flex justify-center gap-3">
          <button class="px-4 py-2 border rounded" @click="closeDeleteModal">
            Hủy
          </button>
          <button
            :disabled="isSubmitting"
            class="px-4 py-2 bg-red-600 text-white rounded"
            @click="handleConfirmDelete"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { definePageMeta } from '#imports';
import { useAdminProducts } from '../composables/useAdminProducts';
import { useAdminCategories } from '../../categories/composables/useAdminCategories';
import { useImageUrl } from '../../../core/composables/useImageUrl';
import type { Product } from '../types/product.types';

definePageMeta({ layout: 'admin' });

const {
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  filteredProducts,
  searchQuery,
  isLoading,
  isSubmitting,
  errorMessage,
  successMessage,
  clearMessages,
  fetchProducts,
  deleteProduct,
} = useAdminProducts();

const { categories, fetchCategories } = useAdminCategories();

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchCategories()]);
});

// Reset page and fetch when searching
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchProducts();
  }, 500); // debounce 500ms
});

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchProducts();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchProducts();
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchProducts();
  }
};

const getCategoryName = (id: number) => {
  const cat = categories.value.find((c) => c.id === id);
  return cat ? cat.name : 'Unknown';
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(val);
};

const isDeleteModalOpen = ref(false);
const deletingProduct = ref<Product | null>(null);

const openDeleteModal = (p: Product) => {
  deletingProduct.value = p;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deletingProduct.value = null;
};

const handleConfirmDelete = async () => {
  if (deletingProduct.value) {
    await deleteProduct(deletingProduct.value.id);
    closeDeleteModal();
  }
};
</script>
