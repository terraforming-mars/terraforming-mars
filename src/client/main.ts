import {createApp, defineAsyncComponent} from 'vue';

// One stylesheet: Vite handles the global Less and the component styles together.
import '@/styles/common.less';
import App from '@/client/components/App.vue';
import {getPreferences} from '@/client/utils/PreferencesManager';

import i18nPlugin from '@/client/plugins/i18n.plugin';
import {startOauth} from '@/client/oauth';
const PlayerInputFactory = defineAsyncComponent(() => import('@/client/components/PlayerInputFactory.vue'));

// A deploy replaces the hashed chunks. An already open tab still runs the old entry and cannot
// load them any more: reload once to pick up the new entry instead of leaving a broken page.
const PRELOAD_RELOAD_KEY = 'vite-preload-reload';
let preloadReloadTriggered = false;
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  if (preloadReloadTriggered) {
    return;
  }
  preloadReloadTriggered = true;
  try {
    if (sessionStorage.getItem(PRELOAD_RELOAD_KEY) === '1') {
      return;
    }
    sessionStorage.setItem(PRELOAD_RELOAD_KEY, '1');
  } catch {
    // Storage unavailable: the in-memory guard still prevents a loop on this page.
  }
  window.location.reload();
});
// A successful load clears the guard, so the next deploy can recover as well.
window.setTimeout(() => {
  try {
    sessionStorage.removeItem(PRELOAD_RELOAD_KEY);
  } catch {
    // Nothing to clear.
  }
}, 10_000);

declare global {
  interface Window {
    _translations: { [key: string]: string } | undefined;
  }
}

async function bootstrap() {
  const lang = getPreferences().lang;

  if (lang !== 'en') {
    try {
      window._translations = await fetch(`assets/locales/${lang}.json`).then((res) => res.json());
    } catch (err) {
      console.warn(`Cannot load ${lang} translations. See network for details.`);
    }
  }

  const app = createApp(App);

  app.use(i18nPlugin);

  app.component('PlayerInputFactory', PlayerInputFactory);

  if (window.isSecureContext && 'serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js').then(function(registration) {
        console.log('registered the service worker', registration);
      });
    });
  }

  app.mount('#app');

  window.onload = startOauth;
}

bootstrap();
