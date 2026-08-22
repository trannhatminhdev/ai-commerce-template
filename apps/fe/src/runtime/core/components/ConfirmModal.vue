<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <!-- Overlay -->
    <div
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      @click="!isSubmitting && $emit('close')"
    ></div>

    <!-- Modal Content -->
    <div
      class="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl transition-all text-center"
    >
      <div
        :class="[
          'mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4',
          theme.iconBg,
          theme.iconColor,
        ]"
      >
        <!-- Danger Icon (Exclamation) -->
        <svg
          v-if="type === 'danger' || type === 'warning'"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <!-- Success Icon (Check) -->
        <svg
          v-else-if="type === 'success'"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>

        <!-- Primary Icon (Info) -->
        <svg
          v-else
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h3 class="text-base font-bold text-[#1A1C1C]">
        {{ title }}
      </h3>

      <p class="mt-2 text-sm text-[#5C5F60]">
        <slot name="message">
          {{ message }}
        </slot>
      </p>

      <div class="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          class="rounded-lg border border-[#C3C6D6] bg-white px-4 py-2 text-sm font-semibold text-[#434654] hover:bg-slate-50 transition-colors focus:outline-none disabled:opacity-50"
          :disabled="isSubmitting"
          @click="$emit('close')"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          :disabled="isSubmitting"
          :class="[
            'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none',
            theme.buttonBg,
            theme.buttonHover,
          ]"
          @click="$emit('confirm')"
        >
          <span
            v-if="isSubmitting"
            class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
          ></span>
          <span>{{ confirmText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ModalType = 'danger' | 'warning' | 'success' | 'primary';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Xác nhận',
  },
  message: {
    type: String,
    default: 'Bạn có chắc chắn muốn thực hiện thao tác này?',
  },
  confirmText: {
    type: String,
    default: 'Xác nhận',
  },
  cancelText: {
    type: String,
    default: 'Hủy',
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as () => ModalType,
    default: 'danger',
  },
});

defineEmits(['close', 'confirm']);

const theme = computed(() => {
  switch (props.type) {
    case 'success':
      return {
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        buttonBg: 'bg-emerald-600',
        buttonHover: 'hover:bg-emerald-700',
      };
    case 'warning':
      return {
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        buttonBg: 'bg-amber-500',
        buttonHover: 'hover:bg-amber-600',
      };
    case 'primary':
      return {
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        buttonBg: 'bg-[#003D9B]',
        buttonHover: 'hover:bg-[#002f78]',
      };
    case 'danger':
    default:
      return {
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        buttonBg: 'bg-red-600',
        buttonHover: 'hover:bg-red-700',
      };
  }
});
</script>
