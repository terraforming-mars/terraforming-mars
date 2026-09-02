import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import PlanetaryTrackReward from '@/client/components/pathfinders/PlanetaryTrackReward.vue';
import {fakeGameOptionsModel} from '../testHelpers';

describe('PlanetaryTrackReward', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlanetaryTrackReward, {
      ...globalConfig,
      props: {
        reward: 'card',
        gameOptions: fakeGameOptionsModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
