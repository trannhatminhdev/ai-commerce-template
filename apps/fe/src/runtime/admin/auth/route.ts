import { createResolver } from '@nuxt/kit';
import type { NuxtPage } from '@nuxt/schema';

const resolver = createResolver(import.meta.url);

export const ADMIN_LOGIN_ROUTE_NAME = 'admin-login';

export default {
  name: ADMIN_LOGIN_ROUTE_NAME,
  path: '/admin/login',
  file: resolver.resolve('./views/AdminLogin.vue'),
} satisfies NuxtPage;
