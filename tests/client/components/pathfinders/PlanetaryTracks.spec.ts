import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import PlanetaryTracks from '@/client/components/pathfinders/PlanetaryTracks.vue';
import {fakeGameOptionsModel} from '../testHelpers';

describe('PlanetaryTracks', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlanetaryTracks, {
      ...globalConfig,
      props: {
        tracks: {
          venus: 0,
          earth: 0,
          mars: 0,
          jovian: 0,
          moon: 0,
        },
        gameOptions: fakeGameOptionsModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
