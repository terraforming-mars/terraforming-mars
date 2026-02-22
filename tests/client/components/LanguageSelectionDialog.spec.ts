import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import LanguageSelectionDialog from '@/client/components/LanguageSelectionDialog.vue';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import {FakeLocalStorage} from './FakeLocalStorage';

describe('LanguageSelectionDialog', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(LanguageSelectionDialog, {
      localVue: getLocalVue(),
      propsData: {
        preferencesManager: PreferencesManager.INSTANCE,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
