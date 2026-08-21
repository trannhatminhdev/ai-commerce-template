<template>
  <div class="space-y-6 pb-20">
    <div class="flex items-center gap-4 mb-4">
      <NuxtLink
        to="/admin/products"
        class="text-slate-500 hover:text-slate-700"
      >
        &larr; Quay lại danh sách
      </NuxtLink>
      <h1 class="text-2xl font-bold tracking-tight text-[#003D9B]">
        {{ isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}
      </h1>
    </div>

    <div
      v-if="successMessage"
      class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex justify-between"
    >
      <span>{{ successMessage }}</span>
      <button @click="clearMessages">x</button>
    </div>
    <div
      v-if="errorMessage"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex justify-between"
    >
      <span>{{ errorMessage }}</span>
      <button @click="clearMessages">x</button>
    </div>

    <form
      class="space-y-6 bg-white p-6 rounded-xl border shadow-sm"
      @submit.prevent="handleSave"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Info Column -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1"
              >Tên sản phẩm *</label
            >
            <input
              v-model="form.name"
              required
              class="w-full border p-2 rounded focus:ring-1 focus:ring-[#003D9B]"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1">Danh mục *</label>
            <select
              v-model="form.categoryId"
              required
              class="w-full border p-2 rounded focus:ring-1 focus:ring-[#003D9B]"
            >
              <option value="" disabled>-- Chọn danh mục --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Giá bán *</label>
              <input
                v-model="form.price"
                type="number"
                required
                class="w-full border p-2 rounded focus:ring-1 focus:ring-[#003D9B]"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Giá gốc</label>
              <input
                v-model="form.originalPrice"
                type="number"
                class="w-full border p-2 rounded focus:ring-1 focus:ring-[#003D9B]"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1">Tồn kho *</label>
            <input
              v-model="form.stock"
              type="number"
              required
              class="w-full border p-2 rounded focus:ring-1 focus:ring-[#003D9B]"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1">Mô tả</label>
            <textarea
              v-model="form.description"
              class="w-full border p-2 rounded focus:ring-1 focus:ring-[#003D9B]"
              rows="4"
            ></textarea>
          </div>
        </div>

        <!-- Images and Attributes Column -->
        <div class="space-y-6">
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-semibold">Hình ảnh</label>
              <label
                class="text-sm text-[#003D9B] hover:underline cursor-pointer"
              >
                + Tải ảnh lên
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                />
              </label>
            </div>

            <div
              v-for="(img, index) in form.images"
              :key="'saved' + index"
              class="flex gap-2 mb-2 items-center bg-slate-50 p-2 rounded border"
            >
              <img
                :src="useImageUrl(img.imageUrl)"
                class="w-10 h-10 object-cover border rounded"
              />
              <label
                class="flex items-center gap-1 text-sm whitespace-nowrap flex-1 justify-center"
              >
                <input
                  type="radio"
                  name="thumbnail"
                  :checked="img.isThumbnail"
                  @change="setSavedThumbnail(index)"
                />
                Ảnh bìa
              </label>
              <button
                type="button"
                class="text-red-500 font-bold px-2 hover:bg-red-100 rounded"
                @click="removeSavedImage(index)"
              >
                X
              </button>
            </div>

            <div
              v-for="(fileObj, index) in pendingFiles"
              :key="'pending' + index"
              class="flex gap-2 mb-2 items-center bg-yellow-50 p-2 rounded border border-yellow-200"
            >
              <span class="text-sm truncate w-1/3" :title="fileObj.file.name">{{
                fileObj.file.name
              }}</span>
              <label
                class="flex items-center gap-1 text-sm whitespace-nowrap flex-1 justify-center"
              >
                <input
                  type="radio"
                  name="thumbnail"
                  :checked="fileObj.isThumbnail"
                  @change="setPendingThumbnail(index)"
                />
                Ảnh bìa
              </label>
              <button
                type="button"
                class="text-red-500 font-bold px-2 hover:bg-red-100 rounded"
                @click="removePendingFile(index)"
              >
                X
              </button>
            </div>

            <p
              v-if="form.images.length === 0 && pendingFiles.length === 0"
              class="text-sm text-slate-500 italic"
            >
              Chưa có hình ảnh nào.
            </p>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-semibold"
                >Thuộc tính (Specifications)</label
              >
              <button
                type="button"
                class="text-sm text-[#003D9B] hover:underline"
                @click="addSpec"
              >
                + Thêm thuộc tính
              </button>
            </div>
            <div
              v-for="(spec, index) in form.specifications"
              :key="'spec' + index"
              class="flex gap-2 mb-2 items-center"
            >
              <input
                v-model="spec.specName"
                placeholder="Tên (VD: RAM)"
                class="w-1/3 border p-2 rounded text-sm focus:ring-1 focus:ring-[#003D9B]"
                required
              />
              <input
                v-model="spec.specValue"
                placeholder="Giá trị (VD: 8GB)"
                class="flex-1 border p-2 rounded text-sm focus:ring-1 focus:ring-[#003D9B]"
                required
              />
              <button
                type="button"
                class="text-red-500 font-bold px-2"
                @click="removeSpec(index)"
              >
                X
              </button>
            </div>
            <p
              v-if="form.specifications.length === 0"
              class="text-sm text-slate-500 italic"
            >
              Chưa có thuộc tính nào.
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4 border-t">
        <button
          type="submit"
          :disabled="isSaving"
          class="px-6 py-2.5 bg-[#003D9B] text-white rounded-lg font-semibold shadow-xs hover:bg-[#002f78] disabled:opacity-50"
        >
          {{ isSaving ? 'Đang lưu...' : 'Lưu sản phẩm' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute, useRouter, definePageMeta } from '#imports';
import { useAdminProducts } from '../composables/useAdminProducts';
import { useAdminCategories } from '../../categories/composables/useAdminCategories';
import { useImageUrl } from '../../../core/composables/useImageUrl';
import type {
  ProductImage,
  ProductSpecification,
} from '../types/product.types';

definePageMeta({ layout: 'admin' });

const route = useRoute();
const router = useRouter();

const {
  getProductById,
  createProduct,
  updateProduct,
  errorMessage,
  successMessage,
  clearMessages,
  uploadImage,
  deleteImage,
  setThumbnail,
  addSpecification,
  deleteSpecification,
} = useAdminProducts();
const { categories, fetchCategories } = useAdminCategories();

const isEditMode = computed(
  () =>
    route.path.includes('/admin/products/') &&
    route.path !== '/admin/products/create',
);
const productId = computed(() =>
  isEditMode.value ? Number(route.params.id) : null,
);

const form = reactive({
  name: '',
  categoryId: '' as number | '',
  price: 0,
  originalPrice: null as number | null,
  stock: 0,
  description: '',
  images: [] as ProductImage[],
  specifications: [] as ProductSpecification[],
});

const pendingFiles = ref<{ file: File; isThumbnail: boolean }[]>([]);
const originalSpecs = ref<ProductSpecification[]>([]);

onMounted(async () => {
  await fetchCategories();

  if (isEditMode.value && productId.value) {
    const p = await getProductById(productId.value);
    if (p) {
      form.name = p.name;
      form.categoryId = p.categoryId;
      form.price = p.price;
      form.originalPrice = p.originalPrice || null;
      form.stock = p.stock;
      form.description = p.description || '';
      form.images = p.images ? [...p.images] : [];
      form.specifications = p.specifications ? [...p.specifications] : [];
      originalSpecs.value = p.specifications ? [...p.specifications] : [];
    }
  }
});

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    for (let i = 0; i < target.files.length; i++) {
      const file = target.files.item(i);
      if (!file) continue;
      const isThumb =
        form.images.length === 0 && pendingFiles.value.length === 0 && i === 0;
      pendingFiles.value.push({
        file,
        isThumbnail: isThumb,
      });
    }
  }
  // Reset input
  target.value = '';
};

const removePendingFile = (index: number) => {
  pendingFiles.value.splice(index, 1);
  ensureThumbnailExists();
};

const removeSavedImage = async (index: number) => {
  const img = form.images[index];
  if (!img) return;
  if (img.id && productId.value) {
    // Optionally ask for confirmation. Let's just delete directly for now.
    await deleteImage(productId.value, img.id);
  }
  form.images.splice(index, 1);
  ensureThumbnailExists();
};

const setSavedThumbnail = (index: number) => {
  form.images.forEach((img, i) => (img.isThumbnail = i === index));
  pendingFiles.value.forEach((f) => (f.isThumbnail = false));

  const img = form.images[index];
  if (!img) return;
  if (img.id && productId.value) {
    setThumbnail(productId.value, img.id);
  }
};

const setPendingThumbnail = (index: number) => {
  pendingFiles.value.forEach((f, i) => (f.isThumbnail = i === index));
  form.images.forEach((img) => (img.isThumbnail = false));
};

const ensureThumbnailExists = () => {
  const hasThumbnail =
    form.images.some((img) => img.isThumbnail) ||
    pendingFiles.value.some((f) => f.isThumbnail);
  if (!hasThumbnail) {
    if (form.images.length > 0) {
      const firstImg = form.images[0];
      if (firstImg) {
        firstImg.isThumbnail = true;
        if (firstImg.id && productId.value) {
          setThumbnail(productId.value, firstImg.id);
        }
      }
    } else if (pendingFiles.value.length > 0) {
      const firstPending = pendingFiles.value[0];
      if (firstPending) {
        firstPending.isThumbnail = true;
      }
    }
  }
};

const addSpec = () => {
  form.specifications.push({ specName: '', specValue: '' });
};

const removeSpec = (index: number) => {
  form.specifications.splice(index, 1);
};

const isSaving = ref(false);

const handleSave = async () => {
  if (form.categoryId === '') return;
  if (isSaving.value) return; // Prevent double click

  isSaving.value = true;
  try {
    const inputData = {
      name: form.name,
      categoryId: Number(form.categoryId),
      price: Number(form.price),
      originalPrice: form.originalPrice
        ? Number(form.originalPrice)
        : undefined,
      stock: Number(form.stock),
      description: form.description,
    };

    let targetId = productId.value;

    if (isEditMode.value && targetId) {
      await updateProduct(targetId, inputData);
    } else {
      const newProduct = await createProduct(inputData);
      if (newProduct) targetId = newProduct.id;
    }

    if (targetId) {
      // 1. Upload pending images
      for (const pFile of pendingFiles.value) {
        await uploadImage(targetId, pFile.file, pFile.isThumbnail);
      }

      // 2. Sync specifications
      for (const oSpec of originalSpecs.value) {
        if (!form.specifications.find((s) => s.id === oSpec.id)) {
          if (oSpec.id) await deleteSpecification(targetId, oSpec.id);
        }
      }

      for (const spec of form.specifications) {
        if (!spec.id) {
          await addSpecification(targetId, spec.specName, spec.specValue);
        }
      }

      successMessage.value = 'Lưu sản phẩm thành công!';
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    }
  } finally {
    isSaving.value = false;
  }
};
</script>
