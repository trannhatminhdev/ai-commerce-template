import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '#fe': fileURLToPath(new URL('./src/runtime', import.meta.url)),
    },
  },
});
