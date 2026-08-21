import { createResolver } from '@nuxt/kit';
import type { NuxtPage } from '@nuxt/schema';
import {
  ADMIN_CATEGORIES_ROUTE_NAME,
  ADMIN_CATEGORIES_ROUTE_PATH,
} from './constants';

const resolver = createResolver(import.meta.url);

export default {
  name: ADMIN_CATEGORIES_ROUTE_NAME,
  path: ADMIN_CATEGORIES_ROUTE_PATH,
  file: resolver.resolve('./views/AdminCategoriesView.vue'),
} satisfies NuxtPage;
