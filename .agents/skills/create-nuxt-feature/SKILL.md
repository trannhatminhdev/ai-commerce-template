---
name: create-nuxt-feature
description: >-
  Quy trình thêm component, composable, hoặc plugin mới vào Nuxt Module frontend
  (`apps/fe`). Kích hoạt khi người dùng yêu cầu tạo UI component, page, composable,
  hoặc bất kỳ tính năng frontend nào.
---

# Phát triển tính năng cho Nuxt Module Frontend

Frontend (`apps/fe`) là một **Nuxt Module** (không phải Nuxt App thông thường).
Code runtime được đặt trong `apps/fe/src/runtime/` và phải được đăng ký qua
`apps/fe/src/module.ts` bằng các helper từ `@nuxt/kit`.

## Cấu trúc thư mục

```
apps/fe/
├── src/
│   ├── module.ts                    # Nuxt Module definition (đăng ký mọi thứ ở đây)
│   └── runtime/
│       ├── plugin.ts                # Nuxt plugin (đã có sẵn)
│       ├── components/              # Vue components (auto-imported)
│       │   └── AiProduct.vue
│       ├── composables/             # Composables (auto-imported)
│       │   └── useCart.ts
│       ├── server/                  # Server routes / API proxy
│       └── utils/                   # Utility functions
└── playground/                      # App Nuxt để test module trong khi dev
    ├── app.vue
    └── nuxt.config.ts
```

## Quy trình thêm tính năng

### 1. Thêm Vue Component

**Bước 1:** Tạo file component tại `src/runtime/components/<TenComponent>.vue`

```vue
<script setup lang="ts">
// LUÔN dùng <script setup lang="ts"> - Composition API
defineProps<{
  title: string
}>()
</script>

<template>
  <div>{{ title }}</div>
</template>
```

**Bước 2:** Đăng ký trong `src/module.ts` bằng `addComponentsDir`:

```typescript
import { defineNuxtModule, addPlugin, addComponentsDir, createResolver } from '@nuxt/kit'

export default defineNuxtModule<ModuleOptions>({
  // ...
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    
    addPlugin(resolver.resolve('./runtime/plugin'))
    
    // Đăng ký thư mục components để auto-import
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: 'Ai', // Optional: prefix cho component, VD: <AiProduct />
    })
  },
})
```

### 2. Thêm Composable

**Bước 1:** Tạo file tại `src/runtime/composables/<tên>.ts`

```typescript
import { ref } from 'vue'

export function useCart() {
  const items = ref([])
  
  function addItem(item: any) {
    items.value.push(item)
  }
  
  return { items, addItem }
}
```

**Bước 2:** Đăng ký trong `src/module.ts` bằng `addImportsDir`:

```typescript
import { addImportsDir } from '@nuxt/kit'

// Trong setup():
addImportsDir(resolver.resolve('./runtime/composables'))
```

### 3. Thêm Server Route (API Proxy)

**Bước 1:** Tạo file tại `src/runtime/server/api/<route>.ts`

```typescript
export default defineEventHandler(async (event) => {
  // Proxy hoặc xử lý API
  return { data: 'ok' }
})
```

**Bước 2:** Đăng ký trong `src/module.ts` bằng `addServerHandler` hoặc `addServerScanDir`.

### 4. Test trong Playground

- Playground (`apps/fe/playground/`) là một Nuxt App thật dùng để test module
- Thêm page/component test vào `playground/app.vue` hoặc `playground/pages/`
- Chạy dev server: `cd apps/fe && npm run dev`

## Quy tắc quan trọng

1. **LUÔN** dùng `<script setup lang="ts">` cho mọi Vue component (Composition API)
2. **KHÔNG** dùng Options API (`data()`, `methods`, `computed` object syntax)
3. Mọi runtime code PHẢI nằm trong `src/runtime/`, KHÔNG đặt ở `src/` trực tiếp
4. Mọi thứ thêm vào `runtime/` PHẢI được đăng ký trong `src/module.ts`
5. **KHÔNG** thêm extension `.ts` khi resolve path trong `module.ts` (sẽ bị lỗi khi build)
6. Để test, chỉnh sửa trong `playground/`, KHÔNG sửa trực tiếp file trong `src/`
