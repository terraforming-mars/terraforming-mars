import Vue from 'vue';

import {translateTextNode} from '@/directives/i18n';
import {trimEmptyTextNodes} from '@/directives/TrimWhitespace';
import {mainAppSettings} from '@/client/components/App';
import {PreferencesManager} from '@/client/components/PreferencesManager';

declare global {
  interface Window {
    _translations: { [key: string]: string } | undefined;
  }
}

async function bootstrap() {
  const lang = PreferencesManager.load('lang') || 'en';

  if (lang !== 'en') {
    try {
      window._translations = await fetch(`/assets/locales/${lang}.json`).then((res) => res.json());
      // TODO - add a nice loader for this fetch
    } catch (err) {
      console.warn(`Cannot load ${lang} translations. See network for details.`);
    }
  }

  Vue.directive('trim-whitespace', {
    inserted: trimEmptyTextNodes,
    componentUpdated: trimEmptyTextNodes,
  });

  Vue.directive('i18n', {
    inserted: translateTextNode,
    componentUpdated: translateTextNode,
  });

  new Vue(mainAppSettings);
}

bootstrap();

