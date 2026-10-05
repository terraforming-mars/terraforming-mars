import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import HandDiscount from '@/client/components/overview/HandDiscount.vue';
import {CardName} from '@/common/cards/CardName';

describe('HandDiscount', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(HandDiscount, {
      ...globalConfig,
      props: {
        amount: 2,
        conditional: [{source: CardName.CUTTING_EDGE_TECHNOLOGY, amount: 2, appliesTo: 'cards with requirements'}],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
