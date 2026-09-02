import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import HelpHotkeys from '@/client/components/help/HelpHotkeys.vue';

describe('HelpHotkeys', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(HelpHotkeys, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
