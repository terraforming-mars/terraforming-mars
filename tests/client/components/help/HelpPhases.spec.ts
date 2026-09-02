import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import HelpPhases from '@/client/components/help/HelpPhases.vue';

describe('HelpPhases', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(HelpPhases, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
