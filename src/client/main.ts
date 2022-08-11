import Vue from 'vue';

import {trimEmptyTextNodes} from '@/client/directives/TrimWhitespace';
import {MainAppData, mainAppSettings} from '@/client/components/App';
import {getPreferences} from '@/client/utils/PreferencesManager';
import i18nPlugin from '@/client/plugins/i18n.plugin';
import {CombinedVueInstance} from 'vue/types/vue';

declare global {
  interface Window {
    _translations: { [key: string]: string } | undefined;
    // This seems not quite right. Because window.app is of type `any`, I think.
    app: CombinedVueInstance<Vue, MainAppData, {
      showErrorWithInputAlert(message: string, cb?: () => void): void;
      showBugReportDialog(): void;
      updatePlayer(): void;
      updateSpectator(): void;
    }, any, any>;
  }
}

async function bootstrap() {
  const lang = getPreferences().lang;

  if (lang !== 'en') {
    try {
      window._translations = await fetch(`/assets/locales/${lang}.json`).then((res) => res.json());
      // TODO - add a nice loader for this fetch
    } catch (err) {
      console.warn(`Cannot load ${lang} translations. See network for details.`);
    }
  }

  Vue.use(i18nPlugin);

  Vue.directive('trim-whitespace', {
    inserted: trimEmptyTextNodes,
    componentUpdated: trimEmptyTextNodes,
  });

  if (window.isSecureContext && 'serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js').then(function(registration) {
        console.log('registered the service worker', registration);
      });
    });
  }

  window.app = new Vue(mainAppSettings);
}

bootstrap();

