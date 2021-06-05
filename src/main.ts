import Vue from 'vue';

import {translateTextNode} from './directives/i18n';
import {trimEmptyTextNodes} from './directives/TrimWhitespace';
import {mainAppSettings} from './components/App';


Vue.directive('trim-whitespace', {
  inserted: trimEmptyTextNodes,
  componentUpdated: trimEmptyTextNodes,
});


Vue.directive('i18n', {
  inserted: translateTextNode,
  componentUpdated: translateTextNode,
});

new Vue(mainAppSettings);
