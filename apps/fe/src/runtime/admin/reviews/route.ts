import type { NuxtPage } from '@nuxt/schema';

import { ADMIN_REVIEWS_ROUTE_PATH } from './constants';

export default {
  name: 'admin-reviews',
  path: ADMIN_REVIEWS_ROUTE_PATH,
  file: '#fe/admin/reviews/views/AdminReviewsView.vue',
} as NuxtPage;
