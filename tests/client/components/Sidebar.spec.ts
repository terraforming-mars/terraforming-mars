import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import Sidebar from '@/client/components/Sidebar.vue';
import {fakeGameOptionsModel} from './testHelpers';
import {FakeLocalStorage} from './FakeLocalStorage';

describe('Sidebar', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(Sidebar, {
      localVue: getLocalVue(),
      propsData: {
        playerNumber: 2,
        gameOptions: fakeGameOptionsModel(),
        acting_player: true,
        player_color: 'blue',
        generation: 1,
        coloniesCount: 0,
        temperature: -30,
        oxygen: 0,
        oceans: 0,
        venus: 0,
        moonData: {habitatRate: 0, miningRate: 0, logisticsRate: 0},
        turmoil: undefined,
        lastSoloGeneration: 14,
        deckSize: 100,
        discardPileSize: 0,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
