import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import SpectatorHome from '@/client/components/SpectatorHome.vue';
import {fakeGameModel, fakePublicPlayerModel} from './testHelpers';
import * as raw_settings from '@/genfiles/settings.json';

describe('SpectatorHome', () => {
  it('mounts without errors', () => {
    const player = fakePublicPlayerModel();
    const wrapper = shallowMount(SpectatorHome, {
      localVue: getLocalVue(),
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
          updateSpectator: () => {},
        },
      } as any,
      propsData: {
        spectator: {
          game: fakeGameModel(),
          players: [player],
          id: 's-spectator-id',
          thisPlayer: player,
          runId: 'run-id',
          color: 'blue',
        },
        settings: raw_settings,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
