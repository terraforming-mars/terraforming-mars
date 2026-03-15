import {expect} from 'chai';
import {ALL_LANGUAGES} from '@/common/constants';
import {gameLocaleToIntlLocale} from '@/client/utils/LocaleUtils';

describe('gameLocaleToIntlLocale', () => {
  for (const lang of ALL_LANGUAGES) {
    it(`maps '${lang}' to a supported Intl locale`, () => {
      const bcp47 = gameLocaleToIntlLocale(lang);
      const supported = Intl.ListFormat.supportedLocalesOf([bcp47]);
      expect(supported, `'${lang}' resolved to unsupported locale '${bcp47}' — add it to GAME_LOCALE_TO_BCP47`).to.have.length.greaterThan(0);
    });
  }
});
