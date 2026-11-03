import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import PreferencesIcon from '@/client/components/PreferencesIcon.vue';
import {useFakeLocalStorage} from './FakeLocalStorage';

describe('PreferencesIcon', () => {
  useFakeLocalStorage();

  it('mounts without errors', () => {
    const wrapper = shallowMount(PreferencesIcon, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
