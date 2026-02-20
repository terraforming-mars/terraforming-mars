import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import WarningsComponent from '@/client/components/WarningsComponent.vue';

describe('WarningsComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(WarningsComponent, {
      localVue: getLocalVue(),
    });
    expect(wrapper.exists()).to.be.true;
  });
});
