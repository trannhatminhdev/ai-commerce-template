export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  aiCommerceFe: {},
  devServer: {
    port: parseInt(process.env.FE_PORT || '3001', 10),
  },
});
