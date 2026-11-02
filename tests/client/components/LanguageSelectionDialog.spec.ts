import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import LanguageSelectionDialog from '@/client/components/LanguageSelectionDialog.vue';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import {useFakeLocalStorage} from './FakeLocalStorage';

describe('LanguageSelectionDialog', () => {
  useFakeLocalStorage();

  it('mounts without errors', () => {
    const wrapper = shallowMount(LanguageSelectionDialog, {
      ...globalConfig,
      props: {
        preferencesManager: PreferencesManager.INSTANCE,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
