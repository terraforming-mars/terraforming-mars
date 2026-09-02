import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import HelpIconology from '@/client/components/help/HelpIconology.vue';

describe('HelpIconology', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(HelpIconology, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
