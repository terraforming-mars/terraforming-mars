import {$t} from '../directives/i18n';
import {Message} from '../Message';

/*
This mixin indended to be used in templates
to translate dynamic strings.
Example:
<img src="" class="preferences_checkmark" :alt="$t('Completed!')">
*/
export const TranslateMixin = {
  'name': 'TranslateMixin',
  'methods': {
    $t(englishString: string | Message | number | undefined):string {
      return $t(englishString);
    },
  },
};
