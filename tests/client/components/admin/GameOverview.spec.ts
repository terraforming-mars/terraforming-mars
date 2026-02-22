import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import GameOverview from '@/client/components/admin/GameOverview.vue';
import {fakeGameModel} from '../testHelpers';

describe('GameOverview', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GameOverview, {
      localVue: getLocalVue(),
      propsData: {
        status: 'loading',
        game: fakeGameModel(),
        id: 'game-123',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
