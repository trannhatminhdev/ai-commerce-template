<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-between border-t border-[#C3C6D6] bg-white px-4 py-3 sm:px-6 rounded-xl shadow-xs mt-4"
  >
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        @click="goToPage(currentPage - 1)"
      >
        Trang trước
      </button>
      <button
        :disabled="currentPage === totalPages"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        @click="goToPage(currentPage + 1)"
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
          {{ itemName }}
        </p>
      </div>
      <div class="flex items-center gap-4">
        <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 focus:z-20 focus:outline-offset-0"
            @click="goToPage(currentPage - 1)"
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

          <template v-for="(page, index) in visiblePages" :key="index">
            <span
              v-if="page === '...'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
            >
              ...
            </span>
            <button
              v-else
              :class="[
                page === currentPage
                  ? 'relative z-10 inline-flex items-center bg-[#003D9B] px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003D9B]'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
              ]"
              @click="goToPage(page as number)"
            >
              {{ page }}
            </button>
          </template>

          <button
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 focus:z-20 focus:outline-offset-0"
            @click="goToPage(currentPage + 1)"
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

        <form class="flex items-center gap-2" @submit.prevent="handleJump">
          <span class="text-sm text-gray-500">Đến trang:</span>
          <input
            v-model.number="jumpPage"
            type="number"
            min="1"
            :max="totalPages"
            class="w-16 rounded-md border border-gray-300 py-1.5 px-2 text-sm text-center focus:border-[#003D9B] focus:ring-1 focus:ring-[#003D9B] focus:outline-none"
          />
          <button
            type="submit"
            :disabled="!isValidJump"
            class="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Đi
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemName?: string;
}>();

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
}>();

const jumpPage = ref<number | ''>(props.currentPage);

watch(
  () => props.currentPage,
  (newVal) => {
    jumpPage.value = newVal;
  },
);

const isValidJump = computed(() => {
  return (
    typeof jumpPage.value === 'number' &&
    jumpPage.value >= 1 &&
    jumpPage.value <= props.totalPages &&
    jumpPage.value !== props.currentPage
  );
});

const handleJump = () => {
  if (isValidJump.value) {
    goToPage(jumpPage.value as number);
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page);
  }
};

const visiblePages = computed(() => {
  const current = props.currentPage;
  const total = props.totalPages;

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }

  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, '...', current - 1, current, current + 1, '...', total];
});
</script>
