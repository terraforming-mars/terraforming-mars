import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardRowComponent from '@/client/components/card/CardRowComponent.vue';
import {CardRenderItemType} from '@/common/cards/render/CardRenderItemType';

describe('CardRowComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRowComponent, {
      ...globalConfig,
      props: {
        componentData: {
          is: 'item',
          type: CardRenderItemType.MEGACREDITS,
          amount: 5,
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
