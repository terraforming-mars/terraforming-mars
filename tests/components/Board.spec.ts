import {createLocalVue, shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import Board from '../../src/components/Board.vue';
import BoardSpace from '../../src/components/BoardSpace.vue';
import {SpaceModel} from '../../src/models/SpaceModel';
import {SpaceType} from '../../src/SpaceType';

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
  function getLocalVue() {
    const localVue = createLocalVue();
    localVue.directive('trim-whitespace', {});
    localVue.directive('i18n', {});
    return localVue;
  }

  it('has visible tiles on the board', () => {
    const isTileHidden = false;

    const wrapper = shallowMount(Board, {
      localVue: getLocalVue(),
      propsData: {spaces, isTileHidden},
    });

    const boardSpacesWrappers = wrapper.findAllComponents(BoardSpace).wrappers.filter((wrapper) => {
      return wrapper.attributes('data-test') === 'board-space';
    });

    expect(
      boardSpacesWrappers.every((wrapper) => wrapper.props('isTileHidden') === isTileHidden),
    ).to.be.true;
  });

  it('has hidden tiles on the board', () => {
    const isTileHidden = true;

    const wrapper = shallowMount(Board, {
      localVue: getLocalVue(),
      propsData: {spaces, isTileHidden},
    });

    const boardSpacesWrappers = wrapper.findAllComponents(BoardSpace).wrappers.filter((wrapper) => {
      return wrapper.attributes('data-test') === 'board-space';
    });

    expect(
      boardSpacesWrappers.every((wrapper) => wrapper.props('isTileHidden') === isTileHidden),
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
      propsData: {spaces, isTileHidden: true},
    });

    expect(wrapper.find('[data-test=hide-tiles-button]').text()).to.be.eq('show tiles');
  });

  it('renders "hide tiles" in toggle button if tiles are visible', () => {
    const wrapper = shallowMount(Board, {
      localVue: getLocalVue(),
      propsData: {spaces, isTileHidden: false},
    });

    expect(wrapper.find('[data-test=hide-tiles-button]').text()).to.be.eq('hide tiles');
  });
});
