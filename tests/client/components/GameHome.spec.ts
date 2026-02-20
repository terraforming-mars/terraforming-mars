import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import GameHome from '@/client/components/GameHome.vue';
import {fakeGameOptionsModel} from './testHelpers';
import {Phase} from '@/common/Phase';

describe('GameHome', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GameHome, {
      localVue: getLocalVue(),
      propsData: {
        game: {
          activePlayer: 'blue',
          id: 'game-id-123',
          phase: Phase.ACTION,
          players: [{color: 'blue', id: 'p-blue', name: 'Blue'}],
          spectatorId: undefined,
          gameOptions: fakeGameOptionsModel(),
          lastSoloGeneration: 14,
          expectedPurgeTimeMs: 0,
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
