import {expect} from 'chai';
import {shallowMount} from '@vue/test-utils';
import {ALL_LANGUAGES, LANGUAGES} from '@/common/constants';
import LanguageSwitcher from '@/client/components/LanguageSwitcher.vue';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

describe('LanguageSwitcher', () => {
  describe('renders all available languages', () => {
    const wrapper = shallowMount(LanguageSwitcher);

    ALL_LANGUAGES.forEach((lang) => {
      it('render ' + lang, () => {
        const icon = wrapper.find(`.language-icon--${lang}`);
        const expected = icon.attributes('title') as string;
        const e = LANGUAGES[lang];
        expect(expected).to.be.a('string');
        expect(expected).to.satisfy((title: string) => title.startsWith(e[0]));
        expect(expected).to.satisfy((title: string) => title.indexOf(e[1], 1) > 0);
      });
    });
  });

  it('saves language preference', async () => {
    const originalSetPreferences = PreferencesManager.INSTANCE.set;
    let calledKey = '';
    let calledValue = '';
    PreferencesManager.INSTANCE.set = function(key, value: string) {
      calledKey = key;
      calledValue = value;
    };
    const wrapper = shallowMount(LanguageSwitcher, {
      data() {
        return {PreferencesManager};
      },
    });
    let called = false;
    (wrapper.vm as unknown as typeof LanguageSwitcher.prototype.methods).reloadWindow = function() {
      called = true;
    };
    await wrapper.find('.language-icon--en').trigger('click');
    expect(calledKey).to.be.eq('lang');
    expect(calledValue).to.be.eq('en');
    expect(called).to.be.true;
    PreferencesManager.INSTANCE.set = originalSetPreferences;
  });
});
