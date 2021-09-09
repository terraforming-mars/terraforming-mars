import {createLocalVue, mount} from '@vue/test-utils';
import {expect} from 'chai';
import BoardSpace from '@/components/BoardSpace.vue';

describe('BoardSpace', () => {
  function getLocalVue() {
    const localVue = createLocalVue();
    localVue.directive('trim-whitespace', {});
    localVue.directive('i18n', {});
    return localVue;
  }

  it('has visible tile', async () => {
    const wrapper = mount(BoardSpace, {
      localVue: getLocalVue(),
      propsData: {
        space: {id: 'm1'},
      },
    });

    expect(wrapper.find('[data-test="tile"]').classes()).to.not.contain('board-hidden-tile');
  });

  it('has hidden tile if hidden props is passed', async () => {
    const wrapper = mount(BoardSpace, {
      localVue: getLocalVue(),
      propsData: {
        space: {id: 'm1'},
        hideTiles: true,
      },
    });

    expect(wrapper.find('[data-test="tile"]').classes()).to.contain('board-hidden-tile');
  });
});
