import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import PreferencesIcon from '@/client/components/PreferencesIcon.vue';
import {FakeLocalStorage} from './FakeLocalStorage';

describe('PreferencesIcon', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(PreferencesIcon, {
      localVue: getLocalVue(),
    });
    expect(wrapper.exists()).to.be.true;
  });
});
