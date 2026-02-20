import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import PlanetaryTrack from '@/client/components/pathfinders/PlanetaryTrack.vue';
import {fakeGameOptionsModel} from '../testHelpers';

describe('PlanetaryTrack', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlanetaryTrack, {
      localVue: getLocalVue(),
      propsData: {
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
