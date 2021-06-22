import {$t} from '../directives/i18n';

/*
This mixin indended to be used in templates
to translate dynamic strings.
Example:
<img src="" class="preferences_checkmark" :alt="$t('Completed!')">
*/
export const TranslateMixin = {
  methods: {
    $t,
  },
};
