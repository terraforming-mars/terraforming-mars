import {mount} from '@vue/test-utils';
import {getLocalVue} from '../getLocalVue';
import {expect} from 'chai';
import MoonSpace from '@/client/components/moon/MoonSpace.vue';

describe('MoonSpace', () => {
  it('has visible tile', async () => {
    const wrapper = mount(MoonSpace, {
      localVue: getLocalVue(),
      propsData: {
        space: {id: 'm1'},
      },
    });

    expect(wrapper.find('[data-test="tile"]').classes()).to.not.contain('board-hidden-tile');
  });

  it('has hidden tile if hidden props is passed', async () => {
    const wrapper = mount(MoonSpace, {
      localVue: getLocalVue(),
      propsData: {
        space: {id: 'm1'},
        hideTiles: true,
      },
    });

    expect(wrapper.find('[data-test="tile"]').classes()).to.contain('board-hidden-tile');
  });
});
