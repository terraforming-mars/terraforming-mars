import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import HelpRulebooks from '@/client/components/help/HelpRulebooks.vue';

describe('HelpRulebooks', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(HelpRulebooks, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
