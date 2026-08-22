<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-[#003D9B]">
          Quản lý đánh giá
        </h1>
        <p class="mt-1 text-sm text-[#5C5F60]">
          Danh sách đánh giá của khách hàng về sản phẩm.
        </p>
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
          Đang tải danh sách đánh giá...
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="reviews.length === 0"
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-base font-semibold text-[#1A1C1C]">
          Chưa có đánh giá nào
        </h3>
        <p class="mt-1 text-sm text-[#5C5F60] max-w-sm">
          Khách hàng chưa có đánh giá nào về các sản phẩm.
        </p>
      </div>

      <!-- Reviews Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-[#1A1C1C]">
          <thead
            class="border-b border-[#C3C6D6] bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#434654]"
          >
            <tr>
              <th scope="col" class="px-6 py-3.5 w-24">ID</th>
              <th scope="col" class="px-6 py-3.5 w-64">Sản phẩm</th>
              <th scope="col" class="px-6 py-3.5 w-48">Khách hàng</th>
              <th scope="col" class="px-6 py-3.5 w-32">Đánh giá</th>
              <th scope="col" class="px-6 py-3.5 min-w-[200px]">
                Nội dung & Phản hồi
              </th>
              <th scope="col" class="px-6 py-3.5 w-36 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E2E2E2]">
            <tr
              v-for="review in reviews"
              :key="review.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="px-6 py-4 font-mono text-xs text-[#5C5F60]">
                <span class="rounded bg-slate-100 px-2 py-1 font-semibold"
                  >#{{ review.id }}</span
                >
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="
                      review.product?.images?.[0]?.imageUrl ||
                      'https://placehold.co/100x100?text=No+Image'
                    "
                    alt="Product Image"
                    class="w-10 h-10 object-cover rounded-md border border-gray-200"
                  />
                  <span
                    class="font-medium text-[#003D9B] truncate max-w-[150px]"
                    :title="review.product?.name"
                    >{{ review.product?.name }}</span
                  >
                </div>
              </td>
              <td
                class="px-6 py-4 font-medium text-[#1A1C1C] truncate"
                :title="review.user?.fullName"
              >
                {{ review.user?.fullName }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center text-amber-400">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="w-4 h-4"
                    :class="
                      i <= review.rating
                        ? 'fill-current'
                        : 'text-gray-300 fill-current'
                    "
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm">
                  <p v-if="review.comment" class="text-[#1A1C1C] italic">
                    "{{ review.comment }}"
                  </p>
                  <p v-else class="text-gray-400 italic">Không có bình luận</p>
                  <div
                    v-if="review.adminReply"
                    class="mt-2 bg-slate-100 p-2 rounded border-l-2 border-[#003D9B] text-xs"
                  >
                    <span class="font-semibold text-[#003D9B]"
                      >Admin phản hồi:</span
                    >
                    {{ review.adminReply }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none"
                    title="Phản hồi"
                    @click="openReplyModal(review)"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none"
                    title="Xóa đánh giá"
                    @click="openDeleteModal(review)"
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
      item-name="đánh giá"
      @update:current-page="goToPage"
    />

    <!-- Reply Modal -->
    <AppModal
      :is-open="isReplyModalOpen"
      title="Phản hồi đánh giá"
      @close="isReplyModalOpen = false"
    >
      <template #default>
        <div class="mt-2 space-y-4">
          <div
            class="bg-slate-50 p-3 rounded text-sm italic border border-slate-200"
          >
            "{{ selectedReview?.comment || 'Không có bình luận' }}"
          </div>
          <div>
            <label
              for="replyText"
              class="block text-sm font-medium text-gray-700"
              >Nội dung phản hồi</label
            >
            <div class="mt-1">
              <textarea
                id="replyText"
                v-model="replyText"
                rows="4"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              ></textarea>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          :disabled="isSubmitting"
          @click="submitReply"
        >
          {{ isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi' }}
        </button>
        <button
          type="button"
          class="mt-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
          :disabled="isSubmitting"
          @click="isReplyModalOpen = false"
        >
          Hủy
        </button>
      </template>
    </AppModal>

    <!-- Delete Confirm Modal -->
    <AppConfirmModal
      :is-open="isDeleteModalOpen"
      :is-submitting="isSubmitting"
      type="danger"
      title="Xóa đánh giá"
      confirm-text="Xóa"
      @close="closeDeleteModal"
      @confirm="handleConfirmDelete"
    >
      <template #message>
        Bạn có chắc muốn xóa đánh giá của khách hàng này không?
      </template>
    </AppConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { definePageMeta } from '#imports';
import { useAdminReviews } from '#fe/admin/reviews/composables/useAdminReviews';
import type { Review } from '#fe/admin/reviews/types/review.types';
import { useToast } from '#fe/core/composables/useToast';

definePageMeta({
  layout: 'admin',
});

const {
  reviews,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  isLoading,
  isSubmitting,
  fetchReviews,
  deleteReview,
  replyToReview,
} = useAdminReviews();

const toast = useToast();

const isReplyModalOpen = ref(false);
const selectedReview = ref<Review | null>(null);
const replyText = ref('');

onMounted(async () => {
  await fetchReviews();
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchReviews();
  }
};

const openReplyModal = (review: Review) => {
  selectedReview.value = review;
  replyText.value = review.adminReply || '';
  isReplyModalOpen.value = true;
};

const submitReply = async () => {
  if (!selectedReview.value || !replyText.value.trim()) {
    toast.error('Vui lòng nhập nội dung phản hồi.');
    return;
  }
  const success = await replyToReview(selectedReview.value.id, replyText.value);
  if (success) {
    isReplyModalOpen.value = false;
  }
};

const isDeleteModalOpen = ref(false);
const deletingReview = ref<Review | null>(null);

const openDeleteModal = (review: Review) => {
  deletingReview.value = review;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deletingReview.value = null;
};

const handleConfirmDelete = async () => {
  if (deletingReview.value) {
    const success = await deleteReview(deletingReview.value.id);
    if (success) {
      closeDeleteModal();
    }
  }
};
</script>
