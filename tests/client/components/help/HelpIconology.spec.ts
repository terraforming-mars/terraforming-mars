import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import HelpIconology from '@/client/components/help/HelpIconology.vue';

describe('HelpIconology', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(HelpIconology, {
      localVue: getLocalVue(),
    });
    expect(wrapper.exists()).to.be.true;
  });
});
