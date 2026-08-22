<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-[#003D9B]">
          Quản lý danh mục
        </h1>
        <p class="mt-1 text-sm text-[#5C5F60]">
          Danh sách và thông tin các danh mục sản phẩm trên hệ thống.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003D9B] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#002f78] active:bg-[#00245e] focus:outline-none focus:ring-2 focus:ring-[#003D9B] focus:ring-offset-2"
        @click="openCreateModal"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Thêm danh mục</span>
      </button>
    </div>

    <!-- Filters & Stats Card -->
    <div
      class="flex flex-col gap-3 rounded-xl border border-[#C3C6D6] bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="relative flex-1 max-w-md">
        <span
          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#737685]"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm danh mục theo tên..."
          class="w-full rounded-lg border border-[#C3C6D6] bg-white py-2 pl-10 pr-4 text-sm text-[#1A1C1C] placeholder-[#737685] transition-colors focus:border-[#003D9B] focus:outline-none focus:ring-1 focus:ring-[#003D9B]"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-[#737685] hover:text-[#1A1C1C]"
          @click="searchQuery = ''"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-2 text-xs font-semibold text-[#434654]">
        <span class="rounded-full bg-[#DAE2FF] px-3 py-1 text-[#0040A2]">
          Tổng cộng: {{ categories.length }} danh mục
        </span>
      </div>
    </div>

    <!-- Table Section -->
    <div
      class="overflow-hidden rounded-xl border border-[#C3C6D6] bg-white shadow-xs"
    >
      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#003D9B] border-r-transparent"
        ></div>
        <p class="mt-3 text-sm text-[#5C5F60]">
          Đang tải danh sách danh mục...
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredCategories.length === 0"
        class="p-12 text-center flex flex-col items-center justify-center"
      >
        <div
          class="flex h-14 w-14 items-center justify-center rounded-full bg-[#DAE2FF] text-[#003D9B]"
        >
          <svg
            class="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-base font-semibold text-[#1A1C1C]">
          {{
            searchQuery
              ? 'Không tìm thấy danh mục phù hợp'
              : 'Chưa có danh mục nào'
          }}
        </h3>
        <p class="mt-1 text-sm text-[#5C5F60] max-w-sm">
          {{
            searchQuery
              ? `Không có kết quả nào khớp với "${searchQuery}". Vui lòng thử từ khóa khác.`
              : 'Hãy bắt đầu tạo danh mục đầu tiên để phân loại các sản phẩm trong cửa hàng.'
          }}
        </p>
        <button
          v-if="!searchQuery"
          type="button"
          class="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#003D9B] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#002f78] transition-colors"
          @click="openCreateModal"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Tạo danh mục ngay</span>
        </button>
      </div>

      <!-- Categories Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-[#1A1C1C]">
          <thead
            class="border-b border-[#C3C6D6] bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#434654]"
          >
            <tr>
              <th scope="col" class="px-6 py-3.5 w-24">ID</th>
              <th scope="col" class="px-6 py-3.5">Tên danh mục</th>
              <th scope="col" class="px-6 py-3.5 w-48">Ngày tạo</th>
              <th scope="col" class="px-6 py-3.5 w-36 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E2E2E2]">
            <tr
              v-for="cat in filteredCategories"
              :key="cat.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="px-6 py-4 font-mono text-xs text-[#5C5F60]">
                <span class="rounded bg-slate-100 px-2 py-1 font-semibold">
                  #{{ cat.id }}
                </span>
              </td>
              <td class="px-6 py-4 font-medium text-[#1A1C1C]">
                {{ cat.name }}
              </td>
              <td class="px-6 py-4 text-[#5C5F60] text-xs">
                {{ formatDate(cat.createdAt) }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-[#003D9B] transition-colors focus:outline-none"
                    title="Chỉnh sửa danh mục"
                    @click="openEditModal(cat)"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none"
                    title="Xóa danh mục"
                    @click="openDeleteModal(cat)"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        @click="closeModal"
      />

      <div
        class="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl transition-all"
      >
        <div
          class="flex items-center justify-between pb-4 border-b border-slate-100"
        >
          <h3 class="text-lg font-bold text-[#003D9B]">
            {{ editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới' }}
          </h3>
          <button
            type="button"
            class="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
            @click="closeModal"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form class="mt-4 space-y-4" @submit.prevent="handleSaveCategory">
          <div class="flex flex-col gap-1.5">
            <label
              for="category-name"
              class="text-sm font-semibold text-[#434654]"
            >
              Tên danh mục <span class="text-red-500">*</span>
            </label>
            <input
              id="category-name"
              ref="nameInputRef"
              v-model="formName"
              type="text"
              required
              placeholder="Nhập tên danh mục (VD: Laptop, Điện thoại...)"
              class="w-full rounded-lg border border-[#C3C6D6] bg-white px-3.5 py-2.5 text-sm text-[#1A1C1C] placeholder-[#737685] transition-colors focus:border-[#003D9B] focus:outline-none focus:ring-1 focus:ring-[#003D9B]"
            />
            <p v-if="formError" class="text-xs text-red-600 font-medium mt-0.5">
              {{ formError }}
            </p>
          </div>

          <div
            class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100"
          >
            <button
              type="button"
              class="rounded-lg border border-[#C3C6D6] bg-white px-4 py-2 text-sm font-semibold text-[#434654] hover:bg-slate-50 transition-colors focus:outline-none"
              @click="closeModal"
            >
              Hủy
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003D9B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002f78] transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none"
            >
              <span
                v-if="isSubmitting"
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
              />
              <span>{{
                editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'
              }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <AppConfirmModal
      :is-open="isDeleteModalOpen"
      :is-submitting="isSubmitting"
      title="Xác nhận xóa danh mục"
      @close="closeDeleteModal"
      @confirm="handleConfirmDelete"
    >
      <template #message>
        Bạn có chắc chắn muốn xóa danh mục
        <strong class="text-[#1A1C1C]">"{{ deletingCategory?.name }}"</strong>?
        Thao tác này không thể hoàn tác.
      </template>
    </AppConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { definePageMeta } from '#imports';
import { useAdminCategories } from '#fe/admin/categories/composables/useAdminCategories';
import type { Category } from '#fe/admin/categories/types/category.types';

definePageMeta({
  layout: 'admin',
});

const {
  categories,
  filteredCategories,
  searchQuery,
  isLoading,
  isSubmitting,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = useAdminCategories();

// Form / Modal states
const isModalOpen = ref(false);
const editingCategory = ref<Category | null>(null);
const formName = ref('');
const formError = ref<string | null>(null);
const nameInputRef = ref<HTMLInputElement | null>(null);

// Delete Modal states
const isDeleteModalOpen = ref(false);
const deletingCategory = ref<Category | null>(null);

onMounted(async () => {
  await fetchCategories();
});

const openCreateModal = () => {
  editingCategory.value = null;
  formName.value = '';
  formError.value = null;
  isModalOpen.value = true;
  nextTick(() => {
    nameInputRef.value?.focus();
  });
};

const openEditModal = (cat: Category) => {
  editingCategory.value = cat;
  formName.value = cat.name;
  formError.value = null;
  isModalOpen.value = true;
  nextTick(() => {
    nameInputRef.value?.focus();
  });
};

const closeModal = () => {
  isModalOpen.value = false;
  editingCategory.value = null;
  formName.value = '';
  formError.value = null;
};

const handleSaveCategory = async () => {
  const trimmed = formName.value.trim();
  if (!trimmed) {
    formError.value = 'Vui lòng nhập tên danh mục.';
    return;
  }

  formError.value = null;

  if (editingCategory.value) {
    const res = await updateCategory(editingCategory.value.id, {
      name: trimmed,
    });
    if (res) {
      closeModal();
    }
  } else {
    const res = await createCategory({
      name: trimmed,
    });
    if (res) {
      closeModal();
    }
  }
};

const openDeleteModal = (cat: Category) => {
  deletingCategory.value = cat;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deletingCategory.value = null;
};

const handleConfirmDelete = async () => {
  if (!deletingCategory.value) return;
  const ok = await deleteCategory(deletingCategory.value.id);
  if (ok) {
    closeDeleteModal();
  }
};

const formatDate = (dateValue?: string | Date) => {
  if (!dateValue) return '-';
  try {
    const date = new Date(dateValue);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(dateValue);
  }
};
</script>
