import { createResolver } from '@nuxt/kit';
import type { NuxtPage } from '@nuxt/schema';
import {
  ADMIN_VOUCHERS_ROUTE_NAME,
  ADMIN_VOUCHERS_ROUTE_PATH,
} from './constants';

const resolver = createResolver(import.meta.url);

export default {
  name: ADMIN_VOUCHERS_ROUTE_NAME,
  path: ADMIN_VOUCHERS_ROUTE_PATH,
  file: resolver.resolve('./views/AdminVouchersView.vue'),
} satisfies NuxtPage;
