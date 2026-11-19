import path from 'node:path';
import {defineConfig, type Plugin} from 'vite';
import vue from '@vitejs/plugin-vue';

// The service worker is empty, but must exist at /sw.js for the notification fallback
// (WaitingFor.vue uses navigator.serviceWorker.ready). Emit it in builds and serve it in dev.
function serviceWorker(): Plugin {
  return {
    name: 'terraforming-mars-service-worker',
    generateBundle() {
      this.emitFile({type: 'asset', fileName: 'sw.js', source: ''});
    },
    configureServer(server) {
      server.middlewares.use('/sw.js', (_req, res) => {
        res.setHeader('Content-Type', 'text/javascript');
        res.end('');
      });
    },
  };
}

// Server routes that must reach the Node server while Vite serves the app in development.
// Client-side routes (/, /player, /cards, /new-game, ...) fall through to Vite's SPA fallback.
const SERVER_PATHS = [
  '/api',
  '/assets',
  '/favicon.ico',
  '/auth',
  '/reset',
  '/autopass',
  '/end_game_log',
  '/load_game',
  '/player/input',
  // Server-checked pages: their redirects and validations must also run in dev.
  '/game',
  '/load',
  '/login',
  '/games-overview',
];

const proxy = Object.fromEntries(SERVER_PATHS.map((prefix) => [
  prefix,
  {target: 'http://localhost:8080', changeOrigin: false},
]));

export default defineConfig({
  plugins: [
    vue({template: {transformAssetUrls: false}}),
    serviceWorker(),
  ],
  publicDir: false,
  resolve: {
    alias: [
      {find: '@', replacement: path.resolve(import.meta.dirname, 'src')},
      {find: /^vue$/, replacement: 'vue/dist/vue.esm-bundler.js'},
    ],
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  css: {
    preprocessorOptions: {
      less: {
        // Same shared tokens and mixins as the <style lang="less"> blocks had before the Vite migration.
        additionalData: '@import "variables.less"; @import "mixins.less";',
        paths: [path.resolve(import.meta.dirname, 'src/styles')],
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy,
    watch: {
      ignored: ['**/build/**', '**/local/**', '**/logs/**', '**/db/**'],
    },
  },
  build: {
    outDir: 'build',
    emptyOutDir: false,
    target: 'es2021',
    sourcemap: 'hidden',
    // One stylesheet for the whole app, generated from the Less link in index.html.
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(import.meta.dirname, 'index.html'),
      output: {
        entryFileNames: 'main-[hash].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (asset) => {
          const name = asset.names?.[0] ?? asset.name ?? '';
          // One stylesheet at the build root; images referenced from it keep the /assets namespace
          return name.endsWith('.css') ? 'client-[hash].css' : 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
