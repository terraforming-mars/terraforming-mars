import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import PlayerTagDiscount from '@/client/components/overview/PlayerTagDiscount.vue';

describe('PlayerTagDiscount', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlayerTagDiscount, {
      ...globalConfig,
      props: {
        amount: 2,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
