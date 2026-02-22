import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardCost from '@/client/components/card/CardCost.vue';

describe('CardCost', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardCost, {
      localVue: getLocalVue(),
      propsData: {
        amount: 10,
        newCost: 8,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
