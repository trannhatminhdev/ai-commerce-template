import {
  addImportsDir,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendPages,
  installModule,
} from '@nuxt/kit';
import { setupAdminRoutes } from './runtime/admin/routes';
import homeRoute from './runtime/user/home/route';

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Base URL của backend API (mặc định: http://localhost:3000/api/v1)
   */
  apiBase?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ai-commerce-fe',
    configKey: 'aiCommerceFe',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    apiBase: 'http://localhost:3000/api/v1',
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Pass module options to runtime config
    nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {};
    nuxt.options.runtimeConfig.public.apiBase =
      (nuxt.options.runtimeConfig.public.apiBase as string) ||
      options.apiBase ||
      'http://localhost:3000/api/v1';

    await installModule('@nuxtjs/tailwindcss', {
      exposeConfig: true,
      config: {
        content: {
          files: [resolver.resolve('./runtime/**/*.{vue,mjs,ts}')],
        },
      },
    });

    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: resolver.resolve('./runtime/core/components'),
        prefix: 'App',
      });
    });

    // Register composables & services
    addImportsDir(resolver.resolve('./runtime/core/composables'));
    addImportsDir(resolver.resolve('./runtime/core/services'));
    addImportsDir(resolver.resolve('./runtime/admin/auth/composables'));
    addImportsDir(resolver.resolve('./runtime/admin/auth/services'));

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'));

    extendPages((pages) => {
      setupAdminRoutes(pages);
      pages.push(homeRoute);
    });
  },
});
