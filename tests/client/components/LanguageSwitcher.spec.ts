import {shallowMount} from '@vue/test-utils';
import {ALL_LANGUAGES, LANGUAGES} from '@/common/constants';
import {expect} from 'chai';
import * as sinon from 'sinon';
import LanguageSwitcher from '@/client/components/LanguageSwitcher.vue';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

describe('LanguageSwitcher', () => {
  it('renders all available languages', () => {
    const wrapper = shallowMount(LanguageSwitcher);

    ALL_LANGUAGES.forEach((lang) => {
      const icon = wrapper.find(`.language-icon--${lang}`);
      expect(icon.attributes('title')).to.be.eq(LANGUAGES[lang]);
    });
  });

  it('saves language preference', async () => {
    const preferenceSaveSpy = sinon.spy(PreferencesManager.INSTANCE, 'set');
    const wrapper = shallowMount(LanguageSwitcher, {
      data() {
        return {PreferencesManager};
      },
    });

    await wrapper.find('.language-icon--en').trigger('click');
    expect(preferenceSaveSpy.calledWith('lang', 'en')).to.be.true;
    preferenceSaveSpy.restore();
  });

  it('reloads application on lang switch', async () => {
    const windowReloadSpy = sinon.spy(window.location, 'reload');
    const wrapper = shallowMount(LanguageSwitcher);

    await wrapper.find('.language-icon--en').trigger('click');
    expect(windowReloadSpy.called).to.be.true;
    windowReloadSpy.restore();
  });
});
