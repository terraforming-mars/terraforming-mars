import Vue from 'vue';

import {trimEmptyTextNodes} from '@/client/directives/TrimWhitespace';
import {mainAppSettings} from '@/client/components/App';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import i18nPlugin from '@/client/plugins/i18n.plugin';

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

  Vue.use(i18nPlugin);

  Vue.directive('trim-whitespace', {
    inserted: trimEmptyTextNodes,
    componentUpdated: trimEmptyTextNodes,
  });


  new Vue(mainAppSettings);
}

bootstrap();

