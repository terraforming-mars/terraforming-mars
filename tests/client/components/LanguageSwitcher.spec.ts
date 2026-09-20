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
        const expected = icon.attributes('data-title') as string;
        const e = LANGUAGES[lang];
        expect(expected).to.be.a('string');
        expect(expected).to.satisfy((title: string) => title.startsWith(e[0]));
        expect(expected).to.satisfy((title: string) => title.indexOf(e[1], 1) > 0);
      });
    });
  });

  it('marks the current language as selected', () => {
    const originalLang = PreferencesManager.INSTANCE.values().lang;
    PreferencesManager.INSTANCE.set('lang', 'de');
    try {
      const wrapper = shallowMount(LanguageSwitcher);
      expect(wrapper.find('.language-icon--de').classes()).to.include('language-icon--selected');
      expect(wrapper.find('.language-icon--en').classes()).to.not.include('language-icon--selected');
      expect(wrapper.findAll('.language-icon--selected')).to.have.lengthOf(1);
    } finally {
      PreferencesManager.INSTANCE.set('lang', originalLang);
    }
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
    (wrapper.vm as any).reloadWindow = () => {
      called = true;
    };
    await wrapper.find('.language-icon--en').trigger('click');
    expect(calledKey).to.be.eq('lang');
    expect(calledValue).to.be.eq('en');
    expect(called).to.be.true;
    PreferencesManager.INSTANCE.set = originalSetPreferences;
  });
});
