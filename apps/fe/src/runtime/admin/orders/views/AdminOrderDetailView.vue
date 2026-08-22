<template>
  <div class="space-y-6 pb-20">
    <div class="flex items-center gap-4 mb-4">
      <NuxtLink to="/admin/orders" class="text-slate-500 hover:text-slate-700">
        &larr; Quay lại danh sách
      </NuxtLink>
      <h1 class="text-2xl font-bold tracking-tight text-[#003D9B]">
        Chi tiết đơn hàng #{{ currentOrder?.id }}
      </h1>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !currentOrder" class="py-12 text-center">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#003D9B] border-r-transparent"
      ></div>
      <p class="mt-3 text-sm text-[#5C5F60]">Đang tải chi tiết đơn hàng...</p>
    </div>

    <div v-else-if="currentOrder" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Order Info Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Products -->
        <div class="bg-white p-6 rounded-xl border shadow-sm">
          <h2 class="text-lg font-bold mb-4">Sản phẩm</h2>
          <div class="space-y-4">
            <div
              v-for="item in currentOrder.items"
              :key="item.id"
              class="flex gap-4 items-center border-b pb-4 last:border-b-0 last:pb-0"
            >
              <img
                v-if="item.product?.images && item.product.images.length > 0"
                :src="
                  useImageUrl(
                    item.product.images.find((img) => img.isThumbnail)
                      ?.imageUrl || item.product.images[0]?.imageUrl,
                  )
                "
                class="w-16 h-16 object-cover rounded border"
              />
              <div
                v-else
                class="w-16 h-16 bg-slate-200 rounded flex items-center justify-center text-xs text-slate-500"
              >
                No Img
              </div>

              <div class="flex-1">
                <p class="font-semibold">
                  {{ item.product?.name || `Sản phẩm #${item.productId}` }}
                </p>
                <p class="text-sm text-slate-500">
                  {{ formatCurrency(item.unitPrice) }} x {{ item.quantity }}
                </p>
              </div>
              <div class="font-bold text-red-600">
                {{ formatCurrency(item.unitPrice * item.quantity) }}
              </div>
            </div>
          </div>
          <div
            class="mt-6 pt-4 border-t flex justify-between items-center font-bold text-lg"
          >
            <span>Tổng cộng:</span>
            <span class="text-red-600">{{
              formatCurrency(currentOrder.totalAmount)
            }}</span>
          </div>
        </div>

        <!-- Customer & Shipping Info -->
        <div
          class="bg-white p-6 rounded-xl border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <h2 class="text-lg font-bold mb-4">Khách hàng</h2>
            <div class="space-y-2 text-sm">
              <p>
                <span class="font-semibold">Tên:</span>
                {{ currentOrder.customerName }}
              </p>
              <p>
                <span class="font-semibold">Số điện thoại:</span>
                {{ currentOrder.customerPhone }}
              </p>
            </div>
          </div>
          <div>
            <h2 class="text-lg font-bold mb-4">Giao hàng</h2>
            <div class="space-y-2 text-sm">
              <p>
                <span class="font-semibold">Địa chỉ:</span>
                {{ currentOrder.shippingAddress }}
              </p>
              <p>
                <span class="font-semibold">Phương thức giao:</span>
                {{ currentOrder.shippingMethod }}
              </p>
              <p>
                <span class="font-semibold">Phương thức thanh toán:</span>
                {{ currentOrder.paymentMethod }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Column -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border shadow-sm">
          <h2 class="text-lg font-bold mb-4">Cập nhật trạng thái</h2>

          <div class="mb-4">
            <span class="block text-sm font-semibold mb-2"
              >Trạng thái hiện tại:</span
            >
            <span
              :class="[
                'px-3 py-1 text-sm font-medium rounded-full inline-block',
                getStatusClass(currentOrder.status),
              ]"
            >
              {{ getStatusText(currentOrder.status) }}
            </span>
          </div>

          <div class="space-y-3 mt-6 border-t pt-4">
            <button
              v-if="currentOrder.status === 'PENDING'"
              class="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
              :disabled="isLoading"
              @click="handleStatusUpdate('PROCESSING')"
            >
              Xác nhận đơn (Chuẩn bị hàng)
            </button>
            <button
              v-if="currentOrder.status === 'PROCESSING'"
              class="w-full py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 disabled:opacity-50"
              :disabled="isLoading"
              @click="handleStatusUpdate('SHIPPED')"
            >
              Bắt đầu giao hàng
            </button>
            <button
              v-if="currentOrder.status === 'SHIPPED'"
              class="w-full py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 disabled:opacity-50"
              :disabled="isLoading"
              @click="handleStatusUpdate('DELIVERED')"
            >
              Đã giao thành công
            </button>

            <button
              v-if="['PENDING', 'PROCESSING'].includes(currentOrder.status)"
              class="w-full py-2 bg-red-100 text-red-700 rounded font-semibold hover:bg-red-200 disabled:opacity-50 mt-4"
              :disabled="isLoading"
              @click="handleStatusUpdate('CANCELLED')"
            >
              Hủy đơn hàng
            </button>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border shadow-sm">
          <h2 class="text-lg font-bold mb-4">Thông tin thêm</h2>
          <div class="space-y-2 text-sm text-slate-600">
            <p>
              <strong>Ngày tạo:</strong>
              {{ new Date(currentOrder.createdAt).toLocaleString('vi-VN') }}
            </p>
            <p>
              <strong>Cập nhật lần cuối:</strong>
              {{ new Date(currentOrder.updatedAt).toLocaleString('vi-VN') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- Confirm Status Modal -->
    <AppConfirmModal
      :is-open="isConfirmModalOpen"
      :is-submitting="isSubmitting"
      :type="pendingStatus === 'CANCELLED' ? 'danger' : 'success'"
      title="Xác nhận chuyển trạng thái"
      confirm-text="Xác nhận"
      @close="closeConfirmModal"
      @confirm="confirmStatusUpdate"
    >
      <template #message>
        Bạn có chắc muốn chuyển trạng thái đơn hàng sang:
        <strong class="text-[#1A1C1C]">{{
          getStatusText(pendingStatus)
        }}</strong
        >?
      </template>
    </AppConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, definePageMeta } from '#imports';
import { useAdminOrders } from '#fe/admin/orders/composables/useAdminOrders';
import { useImageUrl } from '#fe/core/composables/useImageUrl';

definePageMeta({ layout: 'admin' });

const route = useRoute();
const {
  currentOrder,
  isLoading,
  isSubmitting,
  fetchOrderById,
  updateOrderStatus,
} = useAdminOrders();

const orderId = computed(() => Number(route.params.id));

const isConfirmModalOpen = ref(false);
const pendingStatus = ref('');

onMounted(async () => {
  if (orderId.value) {
    await fetchOrderById(orderId.value);
  }
});

const handleStatusUpdate = (status: string) => {
  pendingStatus.value = status;
  isConfirmModalOpen.value = true;
};

const closeConfirmModal = () => {
  isConfirmModalOpen.value = false;
  pendingStatus.value = '';
};

const confirmStatusUpdate = async () => {
  if (pendingStatus.value) {
    const ok = await updateOrderStatus(orderId.value, pendingStatus.value);
    if (ok) {
      closeConfirmModal();
    }
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
