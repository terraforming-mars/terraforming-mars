import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import AdjacencyBonus from '@/client/components/AdjacencyBonus.vue';
import {TileType} from '@/common/TileType';

describe('AdjacencyBonus', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(AdjacencyBonus, {
      ...globalConfig,
      props: {
        tileType: TileType.GREAT_DAM,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('renders no bonus icons for a tile type without an adjacency bonus', () => {
    const wrapper = shallowMount(AdjacencyBonus, {
      ...globalConfig,
      props: {
        tileType: TileType.GREENERY,
      },
    });
    expect(wrapper.findAll('i')).to.have.length(0);
  });
});
