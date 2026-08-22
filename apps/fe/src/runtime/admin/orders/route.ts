import { createResolver } from '@nuxt/kit';
import type { NuxtPage } from '@nuxt/schema';
import {
  ADMIN_ORDERS_ROUTE_NAME,
  ADMIN_ORDERS_ROUTE_PATH,
  ADMIN_ORDER_DETAIL_ROUTE_NAME,
  ADMIN_ORDER_DETAIL_ROUTE_PATH,
} from './constants';

const resolver = createResolver(import.meta.url);

export default [
  {
    name: ADMIN_ORDERS_ROUTE_NAME,
    path: ADMIN_ORDERS_ROUTE_PATH,
    file: resolver.resolve('./views/AdminOrdersView.vue'),
  },
  {
    name: ADMIN_ORDER_DETAIL_ROUTE_NAME,
    path: ADMIN_ORDER_DETAIL_ROUTE_PATH,
    file: resolver.resolve('./views/AdminOrderDetailView.vue'),
  },
] as NuxtPage[];
