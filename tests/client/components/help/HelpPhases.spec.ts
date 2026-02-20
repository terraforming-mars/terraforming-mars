import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import HelpPhases from '@/client/components/help/HelpPhases.vue';

describe('HelpPhases', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(HelpPhases, {
      localVue: getLocalVue(),
    });
    expect(wrapper.exists()).to.be.true;
  });
});
