<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-[#003D9B]">
          Quản lý Voucher
        </h1>
        <p class="mt-1 text-sm text-[#5C5F60]">
          Danh sách và thông tin các mã giảm giá trên hệ thống.
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
        <span>Thêm voucher</span>
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
          placeholder="Tìm kiếm voucher theo mã..."
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
          Tổng cộng: {{ totalItems }} voucher
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
        <p class="mt-3 text-sm text-[#5C5F60]">Đang tải danh sách voucher...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredVouchers.length === 0"
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
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-base font-semibold text-[#1A1C1C]">
          {{
            searchQuery
              ? 'Không tìm thấy voucher phù hợp'
              : 'Chưa có voucher nào'
          }}
        </h3>
        <p class="mt-1 text-sm text-[#5C5F60] max-w-sm">
          {{
            searchQuery
              ? `Không có kết quả nào khớp với "${searchQuery}". Vui lòng thử từ khóa khác.`
              : 'Hãy bắt đầu tạo voucher đầu tiên để cấp phát ưu đãi.'
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
          <span>Tạo voucher ngay</span>
        </button>
      </div>

      <!-- Vouchers Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-[#1A1C1C]">
          <thead
            class="border-b border-[#C3C6D6] bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#434654]"
          >
            <tr>
              <th scope="col" class="px-6 py-3.5 w-24">ID</th>
              <th scope="col" class="px-6 py-3.5">Mã Voucher</th>
              <th scope="col" class="px-6 py-3.5">Giảm giá</th>
              <th scope="col" class="px-6 py-3.5">Loại</th>
              <th scope="col" class="px-6 py-3.5 w-48">Ngày tạo</th>
              <th scope="col" class="px-6 py-3.5 w-36 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E2E2E2]">
            <tr
              v-for="voucher in filteredVouchers"
              :key="voucher.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="px-6 py-4 font-mono text-xs text-[#5C5F60]">
                <span class="rounded bg-slate-100 px-2 py-1 font-semibold">
                  #{{ voucher.id }}
                </span>
              </td>
              <td class="px-6 py-4 font-bold text-[#003D9B] uppercase">
                {{ voucher.code }}
              </td>
              <td class="px-6 py-4 font-medium text-[#1A1C1C]">
                {{
                  formatDiscount(voucher.discountValue, voucher.discountType)
                }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-xs font-medium',
                    voucher.discountType === 'PERCENT'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800',
                  ]"
                >
                  {{
                    voucher.discountType === 'PERCENT'
                      ? 'Phần trăm'
                      : 'Số tiền cố định'
                  }}
                </span>
              </td>
              <td class="px-6 py-4 text-[#5C5F60] text-xs">
                {{ formatDate(voucher.createdAt) }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none"
                    title="Xóa voucher"
                    @click="openDeleteModal(voucher)"
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

    <!-- Pagination -->
    <AppPagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      item-name="mã giảm giá"
      @update:current-page="goToPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { definePageMeta } from '#imports';
import { useAdminVouchers } from '#fe/admin/vouchers/composables/useAdminVouchers';
import type {
  Voucher,
  CreateVoucherInput,
} from '#fe/admin/vouchers/types/voucher.types';

definePageMeta({
  layout: 'admin',
});

const {
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  filteredVouchers,
  searchQuery,
  isLoading,

  fetchVouchers,
} = useAdminVouchers();

// Form / Modal states
const isModalOpen = ref(false);
const form = ref<CreateVoucherInput>({
  code: '',
  discountType: 'PERCENT',
  discountValue: 0,
});
const codeInputRef = ref<HTMLInputElement | null>(null);

// Delete Modal states
const isDeleteModalOpen = ref(false);
const deletingVoucher = ref<Voucher | null>(null);

onMounted(async () => {
  await fetchVouchers();
});

// Reset page and fetch when searching
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchVouchers();
  }, 500); // debounce 500ms
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchVouchers();
  }
};

const openCreateModal = () => {
  form.value = {
    code: '',
    discountType: 'PERCENT',
    discountValue: 0,
  };
  formError.value = null;
  isModalOpen.value = true;
  nextTick(() => {
    codeInputRef.value?.focus();
  });
};

const openDeleteModal = (voucher: Voucher) => {
  deletingVoucher.value = voucher;
  isDeleteModalOpen.value = true;
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

const formatDiscount = (value: number, type: 'PERCENT' | 'FIXED') => {
  if (type === 'PERCENT') {
    return `${value}%`;
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};
</script>
