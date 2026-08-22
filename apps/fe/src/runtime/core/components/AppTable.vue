<template>
  <div
    class="overflow-hidden rounded-xl border border-[#C3C6D6] bg-white shadow-xs"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="p-12 text-center">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#003D9B] border-r-transparent"
      ></div>
      <p class="mt-3 text-sm text-[#5C5F60]">{{ loadingText }}</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="isEmpty"
      class="p-12 text-center flex flex-col items-center justify-center"
    >
      <div
        class="flex h-14 w-14 items-center justify-center rounded-full bg-[#DAE2FF] text-[#003D9B]"
      >
        <slot name="empty-icon">
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
        </slot>
      </div>
      <h3 class="mt-4 text-base font-semibold text-[#1A1C1C]">
        {{ isSearch ? notFoundTitle : emptyTitle }}
      </h3>
      <p class="mt-1 text-sm text-[#5C5F60] max-w-sm">
        {{ isSearch ? notFoundMessage : emptyMessage }}
      </p>
      <div v-if="!isSearch && $slots['empty-action']" class="mt-4">
        <slot name="empty-action"></slot>
      </div>
    </div>

    <!-- Table Data -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left text-sm text-[#1A1C1C]">
        <thead
          class="border-b border-[#C3C6D6] bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#434654]"
        >
          <tr>
            <slot name="header"></slot>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E2E2E2]">
          <slot name="body"></slot>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isLoading: { type: Boolean, default: false },
  isEmpty: { type: Boolean, default: false },
  isSearch: { type: Boolean, default: false },
  loadingText: { type: String, default: 'Đang tải dữ liệu...' },
  emptyTitle: { type: String, default: 'Chưa có dữ liệu' },
  emptyMessage: {
    type: String,
    default: 'Hệ thống chưa ghi nhận dữ liệu nào.',
  },
  notFoundTitle: { type: String, default: 'Không tìm thấy kết quả' },
  notFoundMessage: {
    type: String,
    default: 'Không có dữ liệu nào khớp với từ khóa tìm kiếm.',
  },
});
</script>
