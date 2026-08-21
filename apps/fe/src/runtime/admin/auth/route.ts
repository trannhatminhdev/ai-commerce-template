import { createResolver } from '@nuxt/kit';
import type { NuxtPage } from '@nuxt/schema';
import { ADMIN_LOGIN_ROUTE_NAME, ADMIN_LOGIN_ROUTE_PATH } from './constants';

const resolver = createResolver(import.meta.url);

export default {
  name: ADMIN_LOGIN_ROUTE_NAME,
  path: ADMIN_LOGIN_ROUTE_PATH,
  file: resolver.resolve('./views/AdminLogin.vue'),
} satisfies NuxtPage;
