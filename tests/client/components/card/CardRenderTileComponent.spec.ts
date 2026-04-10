import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardRenderTileComponent from '@/client/components/card/CardRenderTileComponent.vue';
import {TileType} from '@/common/TileType';

describe('CardRenderTileComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRenderTileComponent, {
      ...globalConfig,
      props: {
        item: {
          is: 'tile',
          tile: TileType.CITY,
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
