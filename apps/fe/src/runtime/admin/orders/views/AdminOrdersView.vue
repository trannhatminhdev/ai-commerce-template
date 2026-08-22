<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-[#003D9B]">
          Quản lý đơn hàng
        </h1>
        <p class="mt-1 text-sm text-[#5C5F60]">
          Danh sách và thông tin các đơn hàng trên hệ thống.
        </p>
      </div>
    </div>

    <!-- Search -->
    <div
      class="flex flex-col gap-3 rounded-xl border border-[#C3C6D6] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm theo tên khách hàng..."
        class="w-full max-w-md rounded-lg border border-[#C3C6D6] bg-white py-2 px-4 text-sm focus:border-[#003D9B] focus:outline-none focus:ring-1 focus:ring-[#003D9B]"
      />
      <div class="text-xs font-semibold text-[#434654]">
        <span class="rounded-full bg-[#DAE2FF] px-3 py-1 text-[#0040A2]"
          >Tổng cộng: {{ totalOrders }} đơn hàng</span
        >
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
          Đang tải danh sách đơn hàng...
        </p>
      </div>
      <div
        v-else-if="orders.length === 0"
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-base font-semibold text-[#1A1C1C]">
          {{
            searchQuery
              ? 'Không tìm thấy đơn hàng phù hợp'
              : 'Chưa có đơn hàng nào'
          }}
        </h3>
        <p class="mt-1 text-sm text-[#5C5F60] max-w-sm">
          {{
            searchQuery
              ? `Không có kết quả nào khớp với "${searchQuery}". Vui lòng thử từ khóa khác.`
              : 'Hiện tại hệ thống chưa ghi nhận đơn hàng nào từ khách hàng.'
          }}
        </p>
      </div>
      <table v-else class="w-full text-left text-sm text-[#434654]">
        <thead class="bg-[#F8F9FA] text-xs uppercase text-[#737685]">
          <tr>
            <th class="px-6 py-4 font-semibold">Mã đơn</th>
            <th class="px-6 py-4 font-semibold">Khách hàng</th>
            <th class="px-6 py-4 font-semibold">Tổng tiền</th>
            <th class="px-6 py-4 font-semibold">Trạng thái</th>
            <th class="px-6 py-4 font-semibold">Ngày tạo</th>
            <th class="px-6 py-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E6E8F0]">
          <tr
            v-for="order in orders"
            :key="order.id"
            class="hover:bg-[#F8F9FA]"
          >
            <td class="px-6 py-4 font-medium text-[#1A1C1C]">
              #{{ order.id }}
            </td>
            <td class="px-6 py-4 font-semibold text-[#1A1C1C]">
              {{ order.customerName }}
              <div class="text-xs text-[#737685] font-normal">
                {{ order.customerPhone }}
              </div>
            </td>
            <td class="px-6 py-4 text-red-600 font-semibold">
              {{ formatCurrency(order.totalAmount) }}
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusClass(order.status),
                ]"
              >
                {{ getStatusText(order.status) }}
              </span>
            </td>
            <td class="px-6 py-4">
              {{ new Date(order.createdAt).toLocaleDateString('vi-VN') }}
            </td>
            <td class="px-6 py-4 text-right">
              <NuxtLink
                :to="`/admin/orders/${order.id}`"
                class="text-[#0040A2] hover:underline mr-3"
                >Chi tiết</NuxtLink
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <AppPagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalOrders"
      :items-per-page="itemsPerPage"
      item-name="đơn hàng"
      @update:current-page="goToPage"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { definePageMeta } from '#imports';
import { useAdminOrders } from '#fe/admin/orders/composables/useAdminOrders';

definePageMeta({ layout: 'admin' });

const {
  orders,
  totalOrders,
  isLoading,
  currentPage,
  itemsPerPage,
  totalPages,
  searchQuery,
  fetchOrders,
} = useAdminOrders();

onMounted(async () => {
  await fetchOrders();
});

// Reset page and fetch when searching
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchOrders();
  }, 500); // debounce 500ms
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchOrders();
  }
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(val);
};

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    PENDING: 'Chờ xử lý',
    PROCESSING: 'Đang chuẩn bị',
    SHIPPED: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
  };
  return map[status] || status;
};

const getStatusClass = (status: string) => {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};
</script>
