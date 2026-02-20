import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';
import {CardRenderItemType} from '@/common/cards/render/CardRenderItemType';

describe('CardRenderItemComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRenderItemComponent, {
      localVue: getLocalVue(),
      propsData: {
        item: {
          is: 'item',
          type: CardRenderItemType.MEGACREDITS,
          amount: 3,
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
