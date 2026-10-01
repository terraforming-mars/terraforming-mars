import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import HelpSoloRules from '@/client/components/help/HelpSoloRules.vue';

describe('HelpSoloRules', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(HelpSoloRules, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
