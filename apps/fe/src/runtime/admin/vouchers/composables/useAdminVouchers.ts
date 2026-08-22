import { ref, computed } from 'vue';
import { useState } from '#app';
import { useToast } from '#fe/core/composables/useToast';
import { useAdminAuth } from '#fe/admin/auth/composables/useAdminAuth';
import { adminVouchersService } from '#fe/admin/vouchers/services/admin-vouchers.service';
import type {
  Voucher,
  CreateVoucherInput,
} from '#fe/admin/vouchers/types/voucher.types';

export function useAdminVouchers() {
  const toast = useToast();
  const { accessToken } = useAdminAuth();

  const vouchers = useState<Voucher[]>('admin_vouchers_list', () => []);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalItems = ref(0);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const searchQuery = ref('');

  const filteredVouchers = computed(() => vouchers.value);
  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value),
  );

  /**
   * Tải danh sách voucher từ backend
   */
  const fetchVouchers = async (): Promise<Voucher[]> => {
    isLoading.value = true;

    try {
      const skip = (currentPage.value - 1) * itemsPerPage.value;
      const res = await adminVouchersService.getVouchers(
        {
          skip,
          take: itemsPerPage.value,
          search: searchQuery.value,
        },
        accessToken.value || undefined,
      );
      vouchers.value = res.data;
      totalItems.value = res.total;
      return res.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Không thể tải danh sách voucher.');
      }
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Lấy chi tiết voucher theo ID
   */
  const getVoucherById = async (id: number): Promise<Voucher | null> => {
    isLoading.value = true;

    try {
      const data = await adminVouchersService.getVoucherById(
        id,
        accessToken.value || undefined,
      );
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Không thể tải thông tin voucher.');
      }
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Tạo voucher mới
   */
  const createVoucher = async (
    input: CreateVoucherInput,
  ): Promise<Voucher | null> => {
    if (!input.code || !input.code.trim()) {
      toast.error('Mã voucher không được để trống.');
      return null;
    }

    if (input.discountValue < 0) {
      toast.error('Giá trị giảm giá không được âm.');
      return null;
    }

    isSubmitting.value = true;

    try {
      const newVoucher = await adminVouchersService.createVoucher(
        {
          code: input.code.trim().toUpperCase(),
          discountValue: Number(input.discountValue),
          discountType: input.discountType,
        },
        accessToken.value || undefined,
      );
      vouchers.value = [newVoucher, ...vouchers.value];
      totalItems.value++;

      if (vouchers.value.length > itemsPerPage.value) {
        vouchers.value.pop();
      }

      toast.success('Thêm voucher mới thành công.');
      return newVoucher;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Không thể tạo voucher mới.');
      }
      return null;
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * Xóa voucher
   */
  const deleteVoucher = async (id: number): Promise<boolean> => {
    isSubmitting.value = true;

    try {
      await adminVouchersService.deleteVoucher(
        id,
        accessToken.value || undefined,
      );
      vouchers.value = vouchers.value.filter((v) => v.id !== id);
      if (totalItems.value > 0) totalItems.value--;
      toast.success('Xóa voucher thành công.');

      if (vouchers.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
        fetchVouchers();
      } else if (
        vouchers.value.length < itemsPerPage.value &&
        totalItems.value >= itemsPerPage.value
      ) {
        fetchVouchers();
      }

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Không thể xóa voucher.');
      }
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    vouchers,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    filteredVouchers,
    searchQuery,
    isLoading,
    isSubmitting,
    fetchVouchers,
    getVoucherById,
    createVoucher,
    deleteVoucher,
  };
}
