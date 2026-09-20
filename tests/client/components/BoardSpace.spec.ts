import {mount} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
import {expect} from 'chai';
import BoardSpace from '@/client/components/BoardSpace.vue';
import {SpaceType} from '@/common/boards/SpaceType';
import {SpaceBonus} from '@/common/boards/SpaceBonus';

describe('BoardSpace', () => {
  it('has visible tile', async () => {
    const wrapper = mount(BoardSpace, {
      ...globalConfig,
      props: {
        space: {
          id: 'm01',
          bonus: [],
          x: 0,
          y: 0,
          spaceType: SpaceType.LAND,
        },
        tileView: 'show',
      },
    });

    expect(wrapper.find('[data-test="tile"]').classes()).to.not.contain('board-hidden-tile');
  });

  it('has hidden tile if hidden props is passed', async () => {
    const wrapper = mount(BoardSpace, {
      ...globalConfig,
      props: {
        space: {
          id: 'm01',
          bonus: [],
          x: 0,
          y: 0,
          spaceType: SpaceType.LAND,
        },
        tileView: 'hide',
      },
    });

    expect(wrapper.find('[data-test="tile"]').classes()).to.contain('board-hidden-tile');
  });

  it('renders a neutral player cube instead of a space bonus', async () => {
    const wrapper = mount(BoardSpace, {
      ...globalConfig,
      props: {
        space: {
          id: 'm01',
          bonus: [SpaceBonus.STEEL],
          x: 0,
          y: 0,
          spaceType: SpaceType.LAND,
          cube: 'martian-nature-wonders',
        },
        tileView: 'show',
      },
    });

    expect(wrapper.find('[data-test="cube"]').exists()).is.true;
    expect(wrapper.find('.board-space-bonuses').exists()).is.false;
  });
});
