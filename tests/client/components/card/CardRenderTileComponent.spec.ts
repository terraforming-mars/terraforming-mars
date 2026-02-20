import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardRenderTileComponent from '@/client/components/card/CardRenderTileComponent.vue';
import {TileType} from '@/common/TileType';

describe('CardRenderTileComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRenderTileComponent, {
      localVue: getLocalVue(),
      propsData: {
        item: {
          is: 'tile',
          tile: TileType.CITY,
          hasSymbol: false,
          isAres: false,
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
