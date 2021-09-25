import {shallowMount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import Board from '@/client/components/Board.vue';
import BoardSpace from '@/client/components/BoardSpace.vue';
import {SpaceModel} from '@/models/SpaceModel';
import {SpaceType} from '@/SpaceType';

const spaces: SpaceModel[] = [
  {
    id: '01',
    x: 1,
    y: 1,
    bonus: [],
    spaceType: SpaceType.COLONY,
    color: undefined,
    highlight: undefined,
    tileType: undefined,
  },
  {
    id: '02',
    x: 2,
    y: 1,
    bonus: [],
    spaceType: SpaceType.COLONY,
    color: undefined,
    highlight: undefined,
    tileType: undefined,
  },
  {
    id: '69',
    x: 3,
    y: 1,
    bonus: [],
    spaceType: SpaceType.COLONY,
    color: undefined,
    highlight: undefined,
    tileType: undefined,
  },
  {
    id: '04',
    x: 3,
    y: 1,
    bonus: [],
    spaceType: SpaceType.OCEAN,
    color: undefined,
    highlight: undefined,
    tileType: undefined,
  },
];


describe('MoonBoard', () => {
  it('has visible tiles on the board', () => {
    const hideTiles = false;

    const wrapper = shallowMount(Board, {
      localVue: getLocalVue(),
      propsData: {spaces, hideTiles},
    });

    const boardSpacesWrappers = wrapper.findAllComponents(BoardSpace).wrappers.filter((wrapper) => {
      return wrapper.attributes('data-test') === 'board-space';
    });

    expect(
      boardSpacesWrappers.every((wrapper) => wrapper.props('hideTiles') === hideTiles),
    ).to.be.true;
  });

  it('has hidden tiles on the board', () => {
    const hideTiles = true;

    const wrapper = shallowMount(Board, {
      localVue: getLocalVue(),
      propsData: {spaces, hideTiles},
    });

    const boardSpacesWrappers = wrapper.findAllComponents(BoardSpace).wrappers.filter((wrapper) => {
      return wrapper.attributes('data-test') === 'board-space';
    });

    expect(
      boardSpacesWrappers.every((wrapper) => wrapper.props('hideTiles') === hideTiles),
    ).to.be.true;
  });

  it('emits toggleHideTiles on toggle button click', async () => {
    const wrapper = shallowMount(Board, {
      localVue: getLocalVue(),
      propsData: {spaces},
    });

    await wrapper.find('[data-test=hide-tiles-button]').trigger('click');
    expect(wrapper.emitted('toggleHideTiles')?.length).to.be.eq(1);
  });

  it('renders "show tiles" in toggle button if tiles are hidden', () => {
    const wrapper = shallowMount(Board, {
      localVue: getLocalVue(),
      propsData: {spaces, hideTiles: true},
    });

    expect(wrapper.find('[data-test=hide-tiles-button]').text()).to.be.eq('show tiles');
  });

  it('renders "hide tiles" in toggle button if tiles are visible', () => {
    const wrapper = shallowMount(Board, {
      localVue: getLocalVue(),
      propsData: {spaces, hideTiles: false},
    });

    expect(wrapper.find('[data-test=hide-tiles-button]').text()).to.be.eq('hide tiles');
  });
});
