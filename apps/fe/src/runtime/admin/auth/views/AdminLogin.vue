<template>
  <div
    class="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-[#F9F9F9] font-['Inter',sans-serif] text-[#1A1C1C] antialiased selection:bg-[#003D9B] selection:text-white"
  >
    <!-- Subtle Background Decorative Element (Full screen) -->
    <div
      class="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        class="h-full w-full object-cover"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMin slice"
      >
        <g opacity="0.25" filter="url(#login-blur-1)">
          <ellipse cx="400" cy="150" rx="450" ry="350" fill="#B2C5FF" />
        </g>
        <g opacity="0.35" filter="url(#login-blur-2)">
          <ellipse cx="1050" cy="100" rx="400" ry="300" fill="#E0E7FF" />
        </g>
        <defs>
          <filter
            id="login-blur-1"
            x="-200"
            y="-300"
            width="1200"
            height="900"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur stdDeviation="80" result="effect1_foregroundBlur" />
          </filter>
          <filter
            id="login-blur-2"
            x="500"
            y="-300"
            width="1100"
            height="800"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur stdDeviation="80" result="effect1_foregroundBlur" />
          </filter>
        </defs>
      </svg>
    </div>

    <!-- Main Content Area -->
    <main
      class="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8"
    >
      <!-- Login Card -->
      <div
        class="w-full max-w-[440px] rounded-xl border border-[#DFE1E6]/60 bg-white/90 p-8 shadow-[0px_4px_20px_0px_rgba(9,30,66,0.08)] backdrop-blur-md transition-all"
      >
        <!-- Header Section -->
        <div class="mb-8 flex flex-col items-center text-center">
          <div class="mb-2 flex items-center justify-center gap-2">
            <svg
              width="28"
              height="32"
              viewBox="0 0 27 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="shrink-0 text-[#003D9B]"
              aria-hidden="true"
            >
              <path
                d="M12 29.5875L1.5 23.55C1.025 23.275 0.65625 22.9125 0.39375 22.4625C0.13125 22.0125 0 21.5125 0 20.9625V9.0375C0 8.4875 0.13125 7.9875 0.39375 7.5375C0.65625 7.0875 1.025 6.725 1.5 6.45L12 0.4125C12.475 0.1375 12.975 0 13.5 0C14.025 0 14.525 0.1375 15 0.4125L25.5 6.45C25.975 6.725 26.3438 7.0875 26.6063 7.5375C26.8688 7.9875 27 8.4875 27 9.0375V20.9625C27 21.5125 26.8688 22.0125 26.6063 22.4625C26.3438 22.9125 25.975 23.275 25.5 23.55L15 29.5875C14.525 29.8625 14.025 30 13.5 30C12.975 30 12.475 29.8625 12 29.5875ZM12 15.8625V26.1375L13.5 27L15 26.1375V15.8625L24 10.65V9.075L22.3875 8.1375L13.5 13.275L4.6125 8.1375L3 9.075V10.65L12 15.8625Z"
                fill="currentColor"
              />
            </svg>
            <h1
              class="text-[30px] font-bold leading-10 tracking-[-0.025em] text-[#003D9B]"
            >
              TechPulse
            </h1>
          </div>
          <h2 class="text-xl font-semibold leading-7 text-[#434654]">
            Bảng điều khiển quản trị
          </h2>
          <p class="mt-2 text-sm font-normal leading-5 text-[#5C5F60]">
            Chỉ những người được ủy quyền mới có thể truy cập.
          </p>
        </div>

        <!-- Form Section -->
        <form class="space-y-4" @submit.prevent="handleLogin">
          <!-- Email Input -->
          <div class="flex flex-col gap-1">
            <label
              for="email-address"
              class="text-sm font-semibold tracking-[0.05em] text-[#434654]"
            >
              Email
            </label>
            <div class="relative flex items-center">
              <span
                class="pointer-events-none absolute left-3.5 flex items-center text-[#737685]"
                aria-hidden="true"
              >
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="shrink-0"
                >
                  <path
                    d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM10 9L2 4V14H18V4L10 9ZM10 7L18 2H2L10 7ZM2 4V2V4V14V4Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <input
                id="email-address"
                v-model="email"
                type="email"
                name="email"
                autocomplete="email"
                required
                placeholder="admin@gmail.com"
                class="w-full rounded-[4px] border border-[#C3C6D6] bg-white py-2.5 pl-10 pr-3 text-base text-[#1A1C1C] placeholder-[#737685] transition-colors focus:border-[#003D9B] focus:outline-none focus:ring-1 focus:ring-[#003D9B]"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="text-sm font-semibold tracking-[0.05em] text-[#434654]"
              >
                Mật khẩu
              </label>
            </div>
            <div class="relative flex items-center">
              <span
                class="pointer-events-none absolute left-3.5 flex items-center text-[#737685]"
                aria-hidden="true"
              >
                <svg
                  width="16"
                  height="21"
                  viewBox="0 0 16 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="shrink-0"
                >
                  <path
                    d="M2 21C1.45 21 0.979167 20.8042 0.5875 20.4125C0.195833 20.0208 0 19.55 0 19V9C0 8.45 0.195833 7.97917 0.5875 7.5875C0.979167 7.19583 1.45 7 2 7H3V5C3 3.61667 3.4875 2.4375 4.4625 1.4625C5.4375 0.4875 6.61667 0 8 0C9.38333 0 10.5625 0.4875 11.5375 1.4625C12.5125 2.4375 13 3.61667 13 5V7H14C14.55 7 15.0208 7.19583 15.4125 7.5875C15.8042 7.97917 16 8.45 16 9V19C16 19.55 15.8042 20.0208 15.4125 20.4125C15.0208 20.8042 14.55 21 14 21H2ZM2 19H14V9H2V19ZM8 16C8.55 16 9.02083 15.8042 9.4125 15.4125C9.80417 15.0208 10 14.55 10 14C10 13.45 9.80417 12.9792 9.4125 12.5875C9.02083 12.1958 8.55 12 8 12C7.45 12 6.97917 12.1958 6.5875 12.5875C6.19583 12.9792 6 13.45 6 14C6 14.55 6.19583 15.0208 6.5875 15.4125C6.97917 15.8042 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7ZM2 19V9V19Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                autocomplete="current-password"
                required
                placeholder="••••••••"
                class="w-full rounded-[4px] border border-[#C3C6D6] bg-white py-2.5 pl-10 pr-10 text-base text-[#1A1C1C] placeholder-[#737685] transition-colors focus:border-[#003D9B] focus:outline-none focus:ring-1 focus:ring-[#003D9B]"
              />
              <button
                type="button"
                class="absolute right-3 flex items-center text-[#737685] transition-colors hover:text-[#434654] focus:text-[#003D9B] focus:outline-none"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <svg
                  v-if="!showPassword"
                  width="22"
                  height="15"
                  viewBox="0 0 22 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="shrink-0"
                >
                  <path
                    d="M11 12C12.25 12 13.3125 11.5625 14.1875 10.6875C15.0625 9.8125 15.5 8.75 15.5 7.5C15.5 6.25 15.0625 5.1875 14.1875 4.3125C13.3125 3.4375 12.25 3 11 3C9.75 3 8.6875 3.4375 7.8125 4.3125C6.9375 5.1875 6.5 6.25 6.5 7.5C6.5 8.75 6.9375 9.8125 7.8125 10.6875C8.6875 11.5625 9.75 12 11 12ZM11 10.2C10.25 10.2 9.6125 9.9375 9.0875 9.4125C8.5625 8.8875 8.3 8.25 8.3 7.5C8.3 6.75 8.5625 6.1125 9.0875 5.5875C9.6125 5.0625 10.25 4.8 11 4.8C11.75 4.8 12.3875 5.0625 12.9125 5.5875C13.4375 6.1125 13.7 6.75 13.7 7.5C13.7 8.25 13.4375 8.8875 12.9125 9.4125C12.3875 9.9375 11.75 10.2 11 10.2ZM11 15C8.56667 15 6.35 14.3208 4.35 12.9625C2.35 11.6042 0.9 9.78333 0 7.5C0.9 5.21667 2.35 3.39583 4.35 2.0375C6.35 0.679167 8.56667 0 11 0C13.4333 0 15.65 0.679167 17.65 2.0375C19.65 3.39583 21.1 5.21667 22 7.5C21.1 9.78333 19.65 11.6042 17.65 12.9625C15.65 14.3208 13.4333 15 11 15ZM11 13C12.8833 13 14.6125 12.5042 16.1875 11.5125C17.7625 10.5208 18.9667 9.18333 19.8 7.5C18.9667 5.81667 17.7625 4.47917 16.1875 3.4875C14.6125 2.49583 12.8833 2 11 2C9.11667 2 7.3875 2.49583 5.8125 3.4875C4.2375 4.47917 3.03333 5.81667 2.2 7.5C3.03333 9.18333 4.2375 10.5208 5.8125 11.5125C7.3875 12.5042 9.11667 13 11 13Z"
                    fill="currentColor"
                  />
                </svg>
                <svg
                  v-else
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="shrink-0"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path
                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                  ></path>
                  <path
                    d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                  ></path>
                  <line x1="2" y1="2" x2="22" y2="22"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- Removed Inline Error Alert, handled by global AppToast -->

          <!-- Actions -->
          <div class="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#003D9B] px-4 py-3 text-sm font-semibold tracking-[0.05em] text-white transition-colors hover:bg-[#002f78] active:bg-[#00245e] focus:outline-none focus:ring-2 focus:ring-[#003D9B] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                v-if="isLoading"
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"
              ></span>
              <span>{{ isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}</span>
              <svg
                v-if="!isLoading"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="shrink-0 text-white"
                aria-hidden="true"
              >
                <path
                  d="M7 14V12.4444H12.4444V1.55556H7V0H12.4444C12.8722 0 13.2384 0.152315 13.5431 0.456944C13.8477 0.761574 14 1.12778 14 1.55556V12.4444C14 12.8722 13.8477 13.2384 13.5431 13.5431C13.2384 13.8477 12.8722 14 12.4444 14H7ZM5.44444 10.8889L4.375 9.76111L6.35833 7.77778H0V6.22222H6.35833L4.375 4.23889L5.44444 3.11111L9.33333 7L5.44444 10.8889Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </main>

    <!-- Footer Component -->
    <footer
      class="relative z-10 flex flex-col items-center justify-between gap-4 border-t border-[#E2E2E2] bg-[#F9F9F9] px-6 py-4 text-center sm:flex-row sm:px-10 sm:text-left"
    >
      <p class="text-sm font-bold tracking-[0.05em] text-[#1A1C1C]">
        Bảng điều khiển quản trị v1.0.0
      </p>
    </footer>

    <!-- Global Toast Notifications -->
    <AppToast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAdminAuth } from '#fe/admin/auth/composables/useAdminAuth';

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const { login, isLoading } = useAdminAuth();

const handleLogin = async () => {
  await login(
    {
      email: email.value.trim(),
      password: password.value,
    },
    '/admin',
  );
};
</script>
