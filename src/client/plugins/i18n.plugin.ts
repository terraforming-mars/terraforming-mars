import _Vue from 'vue';
import {translateTextNode, $t} from '@/client/directives/i18n';

declare module 'vue/types/vue' {
  interface Vue {
    $t: typeof $t;
  }
}

export default {
  install: (Vue: typeof _Vue) => {
    Vue.prototype.$t = $t;

    Vue.directive('i18n', {
      inserted: translateTextNode,
      componentUpdated: translateTextNode,
    });
  },
};
