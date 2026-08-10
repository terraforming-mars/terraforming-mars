import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import GameHome from '@/client/components/GameHome.vue';
import {fakeGameOptionsModel} from './testHelpers';
import {Phase} from '@/common/Phase';
import {SimpleGameModel} from '@/common/models/SimpleGameModel';
import {asComplete} from './utils/models';

describe('GameHome', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GameHome, {
      ...globalConfig,
      props: {
        game: asComplete<SimpleGameModel>({
          activePlayer: 'blue',
          id: 'game-id-123',
          phase: Phase.ACTION,
          players: [{color: 'blue', id: 'p-blue', name: 'Blue'}],
          spectatorId: undefined,
          gameOptions: fakeGameOptionsModel(),
          lastSoloGeneration: 14,
          expectedPurgeTimeMs: 0,
        }),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
