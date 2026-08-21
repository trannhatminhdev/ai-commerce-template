import type { NuxtPage } from '@nuxt/schema';
import authRoute from './auth/route';
import categoriesRoute from './categories/route';

export const setupAdminRoutes = (pages: NuxtPage[]) => {
  pages.push(authRoute);
  pages.push(categoriesRoute);
};
