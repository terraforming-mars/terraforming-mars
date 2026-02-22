import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import PlayerTagDiscount from '@/client/components/overview/PlayerTagDiscount.vue';

describe('PlayerTagDiscount', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlayerTagDiscount, {
      localVue: getLocalVue(),
      propsData: {
        amount: 2,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
