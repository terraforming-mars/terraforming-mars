import {shallowMount} from '@vue/test-utils';
import {LANGUAGES} from '@/constants';
import {expect} from 'chai';
import * as sinon from 'sinon';
import LanguageSwitcher from '@/client/components/LanguageSwitcher.vue';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

describe('LanguageSwitcher', () => {
  it('renders all available languages', () => {
    const wrapper = shallowMount(LanguageSwitcher);

    LANGUAGES.forEach((lang) => {
      const icon = wrapper.find(`.language-icon--${lang.id}`);
      expect(icon.attributes('title')).to.be.eq(lang.title);
    });
  });

  it('saves language preference', async () => {
    const preferenceSaveSpy = sinon.spy(PreferencesManager, 'save');
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
