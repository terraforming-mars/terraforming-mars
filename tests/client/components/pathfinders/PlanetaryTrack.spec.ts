import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import PlanetaryTrack from '@/client/components/pathfinders/PlanetaryTrack.vue';
import {fakeGameOptionsModel} from '../testHelpers';

describe('PlanetaryTrack', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlanetaryTrack, {
      ...globalConfig,
      props: {
        val: 0,
        type: 'risingPlayer',
        rewards: {
          spaces: [{risingPlayer: [], everyone: [], mostTags: []}],
        },
        gameOptions: fakeGameOptionsModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
