import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import Help from '@/client/components/help/Help.vue';

describe('Help', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(Help, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
