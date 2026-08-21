import type { NuxtPage } from '@nuxt/schema';
import authRoute from './auth/route';
import categoriesRoute from './categories/route';
import productsRoute from './products/route';

export const setupAdminRoutes = (pages: NuxtPage[]) => {
  pages.push({
    name: 'admin-index',
    path: '/admin',
    redirect: '/admin/categories',
  } as NuxtPage);

  pages.push(authRoute);
  pages.push(categoriesRoute);
  if (Array.isArray(productsRoute)) {
    pages.push(...productsRoute);
  } else {
    pages.push(productsRoute as NuxtPage);
  }
};
