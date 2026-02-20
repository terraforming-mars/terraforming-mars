import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import PlanetaryTrackReward from '@/client/components/pathfinders/PlanetaryTrackReward.vue';
import {fakeGameOptionsModel} from '../testHelpers';

describe('PlanetaryTrackReward', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlanetaryTrackReward, {
      localVue: getLocalVue(),
      propsData: {
        reward: 'card',
        gameOptions: fakeGameOptionsModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
