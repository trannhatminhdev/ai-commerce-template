import { createResolver } from '@nuxt/kit';
import type { NuxtPage } from '@nuxt/schema';

const resolver = createResolver(import.meta.url);

export const ADMIN_LOGIN_ROUTE_NAME = 'admin-login';
export const ADMIN_LOGIN_ROUTE_PATH = '/admin/login';

export default {
  name: ADMIN_LOGIN_ROUTE_NAME,
  path: ADMIN_LOGIN_ROUTE_PATH,
  file: resolver.resolve('./views/AdminLogin.vue'),
} satisfies NuxtPage;
