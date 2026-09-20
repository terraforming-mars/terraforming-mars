import {defineConfig} from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

export default defineConfig({
  plugins: [
    // Leave template asset URLs (e.g. <img src="assets/...">) as plain strings,
    // matching the webpack build, which has no loader rule for images.
    vue({template: {transformAssetUrls: false}}),
  ],
  resolve: {
    alias: {
      '@/': `${path.resolve(import.meta.dirname, 'src')}/`,
      '@tests/': `${path.resolve(import.meta.dirname, 'tests')}/`,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/client/**/*.spec.ts'],
    setupFiles: ['tests/client/vitest.setup.ts'],
    // isolate runs each test individually. Running them in parallel like this
    // provides ~ 9x speed improvement.
    isolate: false,
  },
});
