import {createLocalVue} from '@vue/test-utils';
import i18nPlugin from '@/client/plugins/i18n.plugin';

export function getLocalVue() {
  const localVue = createLocalVue();
  localVue.use(i18nPlugin);
  localVue.directive('trim-whitespace', {});
  return localVue;
}
