import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import DiscountList from '@/client/components/overview/DiscountList.vue';
import {CardName} from '@/common/cards/CardName';

describe('DiscountList', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(DiscountList, {
      ...globalConfig,
      props: {
        discounts: [{source: CardName.CUTTING_EDGE_TECHNOLOGY, amount: 2, appliesTo: 'cards with requirements'}],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
