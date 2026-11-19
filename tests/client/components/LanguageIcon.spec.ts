import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import LanguageIcon from '@/client/components/LanguageIcon.vue';
import {useFakeLocalStorage} from './FakeLocalStorage';

describe('LanguageIcon', () => {
  useFakeLocalStorage();

  it('mounts without errors', () => {
    const wrapper = shallowMount(LanguageIcon, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
