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

    <!-- Feedback Alerts -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div
        v-if="successMessage"
        class="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        role="alert"
      >
        <div class="flex items-center gap-2">
          <svg
            class="h-5 w-5 shrink-0 text-emerald-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ successMessage }}</span>
        </div>
        <button
          type="button"
          class="text-emerald-600 hover:text-emerald-800 focus:outline-none"
          aria-label="Đóng thông báo"
          @click="clearMessages"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div
        v-if="errorMessage"
        class="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        role="alert"
      >
        <div class="flex items-center gap-2">
          <svg
            class="h-5 w-5 shrink-0 text-red-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>
        <button
          type="button"
          class="text-red-600 hover:text-red-800 focus:outline-none"
          aria-label="Đóng thông báo"
          @click="clearMessages"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </Transition>

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
            voucher
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

    <!-- Create Modal -->
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
          <h3 class="text-lg font-bold text-[#003D9B]">Thêm voucher mới</h3>
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

        <form class="mt-4 space-y-4" @submit.prevent="handleSaveVoucher">
          <!-- Code -->
          <div class="flex flex-col gap-1.5">
            <label
              for="voucher-code"
              class="text-sm font-semibold text-[#434654]"
            >
              Mã voucher <span class="text-red-500">*</span>
            </label>
            <input
              id="voucher-code"
              ref="codeInputRef"
              v-model="form.code"
              type="text"
              required
              placeholder="VD: SUMMER2024"
              class="w-full rounded-lg border border-[#C3C6D6] bg-white px-3.5 py-2.5 text-sm uppercase text-[#1A1C1C] placeholder-[#737685] transition-colors focus:border-[#003D9B] focus:outline-none focus:ring-1 focus:ring-[#003D9B]"
            />
          </div>

          <!-- Type -->
          <div class="flex flex-col gap-1.5">
            <label
              for="voucher-type"
              class="text-sm font-semibold text-[#434654]"
            >
              Loại giảm giá <span class="text-red-500">*</span>
            </label>
            <select
              id="voucher-type"
              v-model="form.discountType"
              class="w-full rounded-lg border border-[#C3C6D6] bg-white px-3.5 py-2.5 text-sm text-[#1A1C1C] transition-colors focus:border-[#003D9B] focus:outline-none focus:ring-1 focus:ring-[#003D9B]"
            >
              <option value="PERCENT">Phần trăm (%)</option>
              <option value="FIXED">Số tiền cố định (đ)</option>
            </select>
          </div>

          <!-- Value -->
          <div class="flex flex-col gap-1.5">
            <label
              for="voucher-value"
              class="text-sm font-semibold text-[#434654]"
            >
              Giá trị giảm giá <span class="text-red-500">*</span>
            </label>
            <input
              id="voucher-value"
              v-model.number="form.discountValue"
              type="number"
              min="0"
              required
              :placeholder="
                form.discountType === 'PERCENT' ? 'VD: 10' : 'VD: 50000'
              "
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
              <span>Tạo voucher</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div
      v-if="isDeleteModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        @click="closeDeleteModal"
      />

      <div
        class="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl transition-all text-center"
      >
        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4"
        >
          <svg
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
        </div>

        <h3 class="text-base font-bold text-[#1A1C1C]">Xác nhận xóa voucher</h3>
        <p class="mt-2 text-sm text-[#5C5F60]">
          Bạn có chắc chắn muốn xóa voucher
          <strong class="text-[#1A1C1C] uppercase"
            >"{{ deletingVoucher?.code }}"</strong
          >? Thao tác này không thể hoàn tác.
        </p>

        <div class="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            class="rounded-lg border border-[#C3C6D6] bg-white px-4 py-2 text-sm font-semibold text-[#434654] hover:bg-slate-50 transition-colors focus:outline-none"
            @click="closeDeleteModal"
          >
            Hủy
          </button>
          <button
            type="button"
            :disabled="isSubmitting"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none"
            @click="handleConfirmDelete"
          >
            <span
              v-if="isSubmitting"
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
            />
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { definePageMeta } from '#imports';
import { useAdminVouchers } from '../composables/useAdminVouchers';
import type { Voucher, CreateVoucherInput } from '../types/voucher.types';

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
  isSubmitting,
  errorMessage,
  successMessage,
  clearMessages,
  fetchVouchers,
  createVoucher,
  deleteVoucher,
} = useAdminVouchers();

// Form / Modal states
const isModalOpen = ref(false);
const form = ref<CreateVoucherInput>({
  code: '',
  discountType: 'PERCENT',
  discountValue: 0,
});
const formError = ref<string | null>(null);
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

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchVouchers();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchVouchers();
  }
};

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

const closeModal = () => {
  isModalOpen.value = false;
  formError.value = null;
};

const handleSaveVoucher = async () => {
  if (!form.value.code.trim()) {
    formError.value = 'Vui lòng nhập mã voucher.';
    return;
  }
  if (form.value.discountValue <= 0) {
    formError.value = 'Giá trị giảm giá phải lớn hơn 0.';
    return;
  }
  if (form.value.discountType === 'PERCENT' && form.value.discountValue > 100) {
    formError.value = 'Phần trăm giảm giá không được vượt quá 100%.';
    return;
  }

  formError.value = null;

  const res = await createVoucher(form.value);
  if (res) {
    closeModal();
  }
};

const openDeleteModal = (voucher: Voucher) => {
  deletingVoucher.value = voucher;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deletingVoucher.value = null;
};

const handleConfirmDelete = async () => {
  if (!deletingVoucher.value) return;
  const ok = await deleteVoucher(deletingVoucher.value.id);
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
