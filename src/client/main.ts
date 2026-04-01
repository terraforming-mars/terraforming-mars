import {createApp} from 'vue';

import {trimEmptyTextNodes} from '@/client/directives/TrimWhitespace';
import App from '@/client/components/App';
import PlayerInputFactory from '@/client/components/PlayerInputFactory.vue';
import {getPreferences} from '@/client/utils/PreferencesManager';
import i18nPlugin from '@/client/plugins/i18n.plugin';
import {startOauth} from '@/client/oauth';

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
      // TODO - add a nice loader for this fetch
    } catch (err) {
      console.warn(`Cannot load ${lang} translations. See network for details.`);
    }
  }

  const app = createApp(App);

  app.use(i18nPlugin);

  app.component('player-input-factory', PlayerInputFactory);

  app.directive('trim-whitespace', {
    mounted: trimEmptyTextNodes,
    updated: trimEmptyTextNodes,
  });

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
