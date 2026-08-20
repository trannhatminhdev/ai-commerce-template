import type { NuxtPage } from '@nuxt/schema';
import authRoute from './auth/route';

export const setupAdminRoutes = (pages: NuxtPage[]) => {
  pages.push(authRoute);
};
