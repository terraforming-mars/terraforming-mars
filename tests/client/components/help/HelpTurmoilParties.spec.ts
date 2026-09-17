import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import HelpTurmoilParties from '@/client/components/help/HelpTurmoilParties.vue';

describe('HelpTurmoilParties', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(HelpTurmoilParties, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
