import type { NuxtPage } from '@nuxt/schema';
import authRoute from './auth/route';
import categoriesRoute from './categories/route';
import productsRoute from './products/route';
import ordersRoute from './orders/route';
import vouchersRoute from './vouchers/route';
import reviewsRoute from './reviews/route';

export const setupAdminRoutes = (pages: NuxtPage[]) => {
  pages.push({
    name: 'admin-index',
    path: '/admin',
    redirect: '/admin/categories',
  } as NuxtPage);

  pages.push(authRoute);
  pages.push(categoriesRoute);
  if (Array.isArray(ordersRoute)) {
    pages.push(...ordersRoute);
  } else {
    pages.push(ordersRoute as NuxtPage);
  }
  pages.push(vouchersRoute);
  if (Array.isArray(productsRoute)) {
    pages.push(...productsRoute);
  } else {
    pages.push(productsRoute as NuxtPage);
  }
  pages.push(reviewsRoute as NuxtPage);
};
