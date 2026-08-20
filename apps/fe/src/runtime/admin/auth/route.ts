import { createResolver } from '@nuxt/kit';

const resolver = createResolver(import.meta.url);

export default {
  name: 'admin-login',
  path: '/admin/login',
  file: resolver.resolve('./views/AdminLogin.vue'),
};
