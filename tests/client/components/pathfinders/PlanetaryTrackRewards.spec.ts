import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import PlanetaryTrackRewards from '@/client/components/pathfinders/PlanetaryTrackRewards.vue';
import {fakeGameOptionsModel} from '../testHelpers';

describe('PlanetaryTrackRewards', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlanetaryTrackRewards, {
      ...globalConfig,
      props: {
        rewards: {
          risingPlayer: [],
          everyone: [],
          mostTags: [],
        },
        type: 'risingPlayer',
        gameOptions: fakeGameOptionsModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
