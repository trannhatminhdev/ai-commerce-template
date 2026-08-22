import { ref, computed } from 'vue';
import { useState } from '#app';
import { useToast } from '#fe/core/composables/useToast';
import { useAdminAuth } from '#fe/admin/auth/composables/useAdminAuth';
import { adminOrdersService } from '#fe/admin/orders/services/admin-orders.service';
import type { Order } from '#fe/admin/orders/types/order.types';

export function useAdminOrders() {
  const toast = useToast();
  const { accessToken } = useAdminAuth();

  const orders = useState<Order[]>('admin_orders_list', () => []);
  const currentOrder = useState<Order | null>(
    'admin_current_order',
    () => null,
  );

  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalOrders = ref(0);

  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const searchQuery = ref('');

  const totalPages = computed(() =>
    Math.ceil(totalOrders.value / itemsPerPage.value),
  );

  const fetchOrders = async (): Promise<Order[]> => {
    isLoading.value = true;
    try {
      const skip = (currentPage.value - 1) * itemsPerPage.value;
      const response = await adminOrdersService.getOrders(
        accessToken.value || undefined,
        skip,
        itemsPerPage.value,
        searchQuery.value,
      );
      orders.value = response.data;
      totalOrders.value = response.total;
      return response.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Không thể tải danh sách đơn hàng.');
      }
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchOrderById = async (id: number): Promise<Order | null> => {
    isLoading.value = true;
    try {
      const response = await adminOrdersService.getOrderById(
        id,
        accessToken.value || undefined,
      );
      currentOrder.value = response;
      return response;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Không thể tải thông tin chi tiết đơn hàng.');
      }
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateOrderStatus = async (
    id: number,
    status: string,
  ): Promise<Order | null> => {
    isSubmitting.value = true;
    try {
      const updatedOrder = await adminOrdersService.updateOrderStatus(
        id,
        status,
        accessToken.value || undefined,
      );

      if (currentOrder.value && currentOrder.value.id === id) {
        currentOrder.value = { ...currentOrder.value, status };
      }

      const index = orders.value.findIndex((o) => o.id === id);
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], status };
      }

      toast.success('Cập nhật trạng thái thành công.');
      return updatedOrder;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Không thể cập nhật trạng thái đơn hàng.');
      }
      return null;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    orders,
    currentOrder,
    totalOrders,
    currentPage,
    itemsPerPage,
    totalPages,
    isLoading,
    isSubmitting,
    searchQuery,
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
  };
}
