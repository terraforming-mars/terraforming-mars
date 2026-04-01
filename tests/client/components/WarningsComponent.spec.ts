import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import WarningsComponent from '@/client/components/WarningsComponent.vue';

describe('WarningsComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(WarningsComponent, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
