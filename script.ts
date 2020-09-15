
import Vue from "vue";

import { translateTextNode } from "./src/directives/i18n";
import { trimEmptyTextNodes } from "./src/directives/TrimWhitespace";
import { mainAppSettings } from "./src/components/App";


Vue.directive("trim-whitespace", {
    inserted: trimEmptyTextNodes,
    componentUpdated: trimEmptyTextNodes
});


Vue.directive("i18n", {
    inserted: translateTextNode,
    componentUpdated: translateTextNode
});

new Vue(mainAppSettings);
