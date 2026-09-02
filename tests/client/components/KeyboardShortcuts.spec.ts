import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import KeyboardShortcuts from '@/client/components/KeyboardShortcuts.vue';

describe('KeyboardShortcuts', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(KeyboardShortcuts, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
