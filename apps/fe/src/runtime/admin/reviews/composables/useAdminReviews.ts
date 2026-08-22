import { ref, computed } from 'vue';
import { useState } from '#app';
import { useToast } from '#fe/core/composables/useToast';
import { useAdminAuth } from '#fe/admin/auth/composables/useAdminAuth';
import { adminReviewsService } from '#fe/admin/reviews/services/admin-reviews.service';
import type { Review } from '#fe/admin/reviews/types/review.types';

export function useAdminReviews() {
  const toast = useToast();
  const { accessToken } = useAdminAuth();

  const reviews = useState<Review[]>('admin_reviews_list', () => []);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalItems = ref(0);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const selectedProductId = ref<number | undefined>(undefined);
  const selectedUserId = ref<number | undefined>(undefined);

  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value),
  );

  const fetchReviews = async (): Promise<Review[]> => {
    isLoading.value = true;
    try {
      const res = await adminReviewsService.getReviews(
        {
          page: currentPage.value,
          limit: itemsPerPage.value,
          productId: selectedProductId.value,
          userId: selectedUserId.value,
        },
        accessToken.value || undefined,
      );
      reviews.value = res.data;
      totalItems.value = res.total;
      return res.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Không thể tải danh sách đánh giá.');
      }
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const deleteReview = async (id: number): Promise<boolean> => {
    isSubmitting.value = true;
    try {
      await adminReviewsService.deleteReview(
        id,
        accessToken.value || undefined,
      );
      toast.success('Xóa đánh giá thành công.');
      await fetchReviews();
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Không thể xóa đánh giá.');
      }
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  const replyToReview = async (id: number, reply: string): Promise<boolean> => {
    isSubmitting.value = true;
    try {
      await adminReviewsService.replyToReview(
        id,
        reply,
        accessToken.value || undefined,
      );
      toast.success('Phản hồi đánh giá thành công.');
      await fetchReviews();
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Không thể phản hồi đánh giá.');
      }
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    reviews,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    isLoading,
    isSubmitting,
    selectedProductId,
    selectedUserId,
    fetchReviews,
    deleteReview,
    replyToReview,
  };
}
