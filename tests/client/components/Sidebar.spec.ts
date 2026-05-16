import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
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
      ...globalConfig,
      props: {
        playerNumber: 2,
        isTerraformed: false,
        gameOptions: fakeGameOptionsModel(),
        actingPlayer: true,
        playerColor: 'blue',
        generation: 1,
        coloniesCount: 0,
        temperature: -30,
        oxygen: 0,
        oceans: 0,
        venus: 0,
        moonData: {habitatRate: 0, miningRate: 0, logisticRate: 0},
        turmoil: undefined,
        lastSoloGeneration: 14,
        deckSize: 100,
        discardPileSize: 0,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
