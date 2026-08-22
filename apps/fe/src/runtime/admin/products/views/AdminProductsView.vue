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
    <AppPagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      item-name="sản phẩm"
      @update:current-page="goToPage"
    />
  </div>
  <AppConfirmModal
    :is-open="isDeleteModalOpen"
    :is-submitting="isSubmitting"
    type="danger"
    title="Xóa sản phẩm"
    confirm-text="Xóa"
    @close="closeDeleteModal"
    @confirm="handleConfirmDelete"
  >
    <template #message>
      Bạn có chắc muốn xóa sản phẩm
      <strong>{{ deletingProduct?.name }}</strong> không?
    </template>
  </AppConfirmModal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { definePageMeta } from '#imports';
import { useAdminProducts } from '#fe/admin/products/composables/useAdminProducts';
import { useAdminCategories } from '#fe/admin/categories/composables/useAdminCategories';
import { useImageUrl } from '#fe/core/composables/useImageUrl';
import type { Product } from '#fe/admin/products/types/product.types';

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
  fetchProducts,
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
</script>
