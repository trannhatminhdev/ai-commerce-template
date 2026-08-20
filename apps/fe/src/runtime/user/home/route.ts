import { createResolver } from '@nuxt/kit';
import type { NuxtPage } from '@nuxt/schema';

const resolver = createResolver(import.meta.url);

export default {
  name: 'user-index',
  path: '/',
  file: resolver.resolve('./views/HomeView.vue'),
} satisfies NuxtPage;
