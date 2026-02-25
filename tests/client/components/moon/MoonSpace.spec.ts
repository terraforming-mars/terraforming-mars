import {mount} from '@vue/test-utils';
import {globalConfig} from '../getLocalVue';
import {expect} from 'chai';
import MoonSpace from '@/client/components/moon/MoonSpace.vue';

describe('MoonSpace', () => {
  it('has visible tile', async () => {
    const wrapper = mount(MoonSpace, {
      ...globalConfig,
      props: {
        space: {id: 'm1', bonus: [], spaceType: 'land', color: undefined, tileType: undefined},
      },
    });

    expect(wrapper.find('[data-test="tile"]').classes()).to.not.contain('board-hidden-tile');
  });

  it('has hidden tile if hidden props is passed', async () => {
    const wrapper = mount(MoonSpace, {
      ...globalConfig,
      props: {
        space: {id: 'm1', bonus: [], spaceType: 'land', color: undefined, tileType: undefined},
        tileView: 'hide',
      },
    });

    expect(wrapper.find('[data-test="tile"]').classes()).to.contain('board-hidden-tile');
  });
});
