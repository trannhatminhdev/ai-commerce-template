import { createResolver } from '@nuxt/kit';
import type { NuxtPage } from '@nuxt/schema';
import {
  ADMIN_PRODUCTS_ROUTE_NAME,
  ADMIN_PRODUCTS_ROUTE_PATH,
  ADMIN_PRODUCT_CREATE_ROUTE_NAME,
  ADMIN_PRODUCT_CREATE_ROUTE_PATH,
  ADMIN_PRODUCT_EDIT_ROUTE_NAME,
  ADMIN_PRODUCT_EDIT_ROUTE_PATH,
} from './constants';

const resolver = createResolver(import.meta.url);

export default [
  {
    name: ADMIN_PRODUCTS_ROUTE_NAME,
    path: ADMIN_PRODUCTS_ROUTE_PATH,
    file: resolver.resolve('./views/AdminProductsView.vue'),
  },
  {
    name: ADMIN_PRODUCT_CREATE_ROUTE_NAME,
    path: ADMIN_PRODUCT_CREATE_ROUTE_PATH,
    file: resolver.resolve('./views/AdminProductDetailView.vue'),
  },
  {
    name: ADMIN_PRODUCT_EDIT_ROUTE_NAME,
    path: ADMIN_PRODUCT_EDIT_ROUTE_PATH,
    file: resolver.resolve('./views/AdminProductDetailView.vue'),
  },
] as NuxtPage[];
