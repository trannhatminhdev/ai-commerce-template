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
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ai-commerce-fe',
    configKey: 'aiCommerceFe',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);

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

    // Register composables
    addImportsDir(resolver.resolve('./runtime/core/composables'));

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'));

    extendPages((pages) => {
      setupAdminRoutes(pages);
      pages.push(homeRoute);
    });
  },
});
