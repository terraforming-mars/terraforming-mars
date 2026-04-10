import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import LanguageIcon from '@/client/components/LanguageIcon.vue';
import {FakeLocalStorage} from './FakeLocalStorage';

describe('LanguageIcon', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(LanguageIcon, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
