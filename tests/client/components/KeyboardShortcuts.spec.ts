import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import KeyboardShortcuts from '@/client/components/KeyboardShortcuts.vue';

describe('KeyboardShortcuts', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(KeyboardShortcuts, {
      localVue: getLocalVue(),
    });
    expect(wrapper.exists()).to.be.true;
  });
});
