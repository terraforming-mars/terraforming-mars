import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import GameOverview from '@/client/components/admin/GameOverview.vue';
import {fakeGameModel} from '../testHelpers';

describe('GameOverview', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GameOverview, {
      ...globalConfig,
      props: {
        status: 'loading',
        game: fakeGameModel(),
        id: 'game-123',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
