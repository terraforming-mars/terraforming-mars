import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardCost from '@/client/components/card/CardCost.vue';

describe('CardCost', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardCost, {
      ...globalConfig,
      props: {
        amount: 10,
        newCost: 8,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
