import {App} from 'vue';
import {translateTextNode, $t} from '@/client/directives/i18n';

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: typeof $t;
  }
}

export default {
  install: (app: App) => {
    app.config.globalProperties.$t = $t;

    app.directive('i18n', {
      mounted: (el: HTMLElement, binding: any) => {
        el.setAttribute('tm-has-i18n', 'true');
        translateTextNode(el, binding);
      },
      updated: translateTextNode,
    });
  },
};
