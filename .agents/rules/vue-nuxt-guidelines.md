# Quy tắc Frontend (Nuxt Module + Vue 3 Composition API)

Dự án Frontend (`apps/fe`) là một **Nuxt Module**. Agent PHẢI tuân thủ các quy tắc sau.

## Quy tắc bắt buộc

### 1. Composition API Only

- **LUÔN** sử dụng `<script setup lang="ts">` cho mọi Vue component
- **KHÔNG BAO GIỜ** dùng Options API (`data()`, `methods`, `computed` dạng object, `watch` dạng object)
- Sử dụng `ref()`, `reactive()`, `computed()`, `watch()` từ Vue 3 Composition API

```vue
<!-- ✅ ĐÚNG -->
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

<!-- ❌ SAI - Không dùng Options API -->
<script>
export default {
  data() { return { count: 0 } },
  computed: { doubled() { return this.count * 2 } }
}
</script>
```

### 2. TypeScript bắt buộc

- Tất cả file `.ts` và `<script setup lang="ts">`
- Sử dụng `defineProps<T>()` với generic type thay vì runtime declaration
- Sử dụng `defineEmits<T>()` với generic type

```vue
<script setup lang="ts">
// ✅ ĐÚNG - Type-based props
defineProps<{
  title: string
  count?: number
}>()

// ❌ SAI - Runtime declaration
defineProps({
  title: { type: String, required: true }
})
</script>
```

### 3. Cấu trúc Nuxt Module

- Mọi runtime code PHẢI nằm trong `apps/fe/src/runtime/`
- Mọi component/composable/plugin PHẢI được đăng ký trong `apps/fe/src/module.ts`
- Test tính năng trong `apps/fe/playground/`, không sửa trực tiếp `src/`

### 4. Naming Convention

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Component file | PascalCase | `ProductCard.vue` |
| Composable file | camelCase với prefix `use` | `useCart.ts` |
| Utility file | camelCase | `formatPrice.ts` |
| Component tag | PascalCase | `<ProductCard />` |

### 5. Composables

- Tên composable PHẢI bắt đầu bằng `use` (VD: `useCart`, `useProduct`)
- Composable PHẢI return một object (không return array)
- Đặt trong `src/runtime/composables/`

### 6. State Management

- Ưu tiên sử dụng composables + `useState()` (Nuxt built-in) cho shared state
- Chỉ dùng Pinia nếu state management phức tạp vượt quá khả năng composables
