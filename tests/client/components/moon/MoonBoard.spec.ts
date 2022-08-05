import {shallowMount} from '@vue/test-utils';
import {getLocalVue} from '../getLocalVue';
import {expect} from 'chai';
import MoonBoard from '@/client/components/moon/MoonBoard.vue';
import MoonSpace from '@/client/components/moon/MoonSpace.vue';
import {MoonModel} from '@/common/models/MoonModel';
import {SpaceType} from '@/common/boards/SpaceType';

const model: MoonModel = {
  colonyRate: 0,
  logisticsRate: 0,
  miningRate: 0,
  spaces: [
    {
      id: 'm01',
      x: 1,
      y: 1,
      bonus: [],
      spaceType: SpaceType.COLONY,
      color: undefined,
      highlight: undefined,
      tileType: undefined,
    },
    {
      id: 'm37',
      x: 2,
      y: 1,
      bonus: [],
      spaceType: SpaceType.COLONY,
      color: undefined,
      highlight: undefined,
      tileType: undefined,
    },
    {
      id: 'm02',
      x: 3,
      y: 1,
      bonus: [],
      spaceType: SpaceType.LUNAR_MINE,
      color: undefined,
      highlight: undefined,
      tileType: undefined,
    },
    {
      id: 'm03',
      x: 3,
      y: 1,
      bonus: [],
      spaceType: SpaceType.LAND,
      color: undefined,
      highlight: undefined,
      tileType: undefined,
    },
  ],
};


describe('MoonBoard', () => {
  it('has visible tiles on the board', async () => {
    const wrapper = shallowMount(MoonBoard, {
      localVue: getLocalVue(),
      propsData: {model, tileView: 'show'},
    });

    const boardSpacesWrappers = wrapper.findAllComponents(MoonSpace).wrappers.filter((wrapper) => {
      return wrapper.attributes('data-test') === 'moon-board-space';
    });

    expect(
      boardSpacesWrappers.every((wrapper) => wrapper.props('tileView') === 'show'),
    ).to.be.true;
  });

  it('has hidden tiles on the board', async () => {
    const wrapper = shallowMount(MoonBoard, {
      localVue: getLocalVue(),
      propsData: {model, tileView: 'show'},
    });

    const boardSpacesWrappers = wrapper.findAllComponents(MoonSpace).wrappers.filter((wrapper) => {
      return wrapper.attributes('data-test') === 'moon-board-space';
    });

    expect(
      boardSpacesWrappers.every((wrapper) => wrapper.props('tileView') === 'show'),
    ).to.be.true;
  });
});
