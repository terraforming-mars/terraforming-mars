import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import PlayerHome from '@/client/components/PlayerHome.vue';
import CardSortButtons from '@/client/components/CardSortButtons.vue';
import SortableCards from '@/client/components/SortableCards.vue';
import {fakePlayerViewModel, fakePublicPlayerModel} from './testHelpers';
import {useFakeLocalStorage} from './FakeLocalStorage';
import {CardName} from '@/common/cards/CardName';
import raw_settings from '@/genfiles/settings.json';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import WaitingFor from '@/client/components/WaitingFor.vue';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {RecursivePartial} from '@/common/utils/utils';
import {vi} from 'vitest';

describe('PlayerHome', () => {
  useFakeLocalStorage();
  const originalScrollIntoView = Element.prototype.scrollIntoView;

  beforeEach(() => {
    PreferencesManager.resetForTest();
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    PreferencesManager.resetForTest();
    Element.prototype.scrollIntoView = originalScrollIntoView;
  });

  function mountLayoutPlayer(viewOverrides: RecursivePartial<PlayerViewModel> = {}) {
    const thisPlayer = fakePublicPlayerModel({tableau: [{name: CardName.ECOLINE}]});
    return shallowMount(PlayerHome, {
      ...globalConfig,
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      },
      props: {
        playerView: fakePlayerViewModel({thisPlayer, players: [thisPlayer], ...viewOverrides}),
        settings: raw_settings,
      },
    });
  }

  it('mounts without errors', () => {
    const wrapper = shallowMount(PlayerHome, {
      ...globalConfig,
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      },
      props: {
        playerView: fakePlayerViewModel(),
        settings: raw_settings,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('sort buttons sort the hand', async () => {
    // The hand only renders once the player has a tableau.
    const thisPlayer = fakePublicPlayerModel({tableau: [{name: CardName.ECOLINE}]});
    const playerView = fakePlayerViewModel({thisPlayer, players: [thisPlayer], cardsInHand: [{name: CardName.ANTS}]});
    const wrapper = shallowMount(PlayerHome, {
      ...globalConfig,
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      },
      props: {
        playerView,
        settings: raw_settings,
      },
    });

    wrapper.findComponent(CardSortButtons).vm.$emit('update:sortOrder', {key: 'vp', reversed: false});
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(SortableCards).props('sortOrder')).to.deep.eq({key: 'vp', reversed: false});
  });
  it('switches layout without remounting the pending input and restores the viewport', async () => {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=1260, user-scalable=1';
    document.head.append(viewport);
    const wrapper = mountLayoutPlayer({waitingFor: {type: 'amount', title: 'Select amount', buttonLabel: 'Save', min: 0, max: 4, maxByDefault: false}});
    const input = wrapper.getComponent(WaitingFor).vm;
    try {
      expect(wrapper.classes()).not.include('player-home--experimental');
      PreferencesManager.INSTANCE.set('experimental_layout', true);
      await wrapper.vm.$nextTick();
      expect(wrapper.classes()).include('player-home--experimental');
      expect(viewport.content).eq('width=device-width, initial-scale=1, viewport-fit=cover');
      wrapper.getComponent({name: 'ExperimentalPlayerNavigation'}).vm.$emit('navigate', 'cards');
      await wrapper.vm.$nextTick();
      expect(wrapper.attributes('data-active-panel')).eq('cards');
      expect(wrapper.getComponent(WaitingFor).vm).eq(input);
      wrapper.get('[data-test="classic-layout"]').trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.classes()).not.include('player-home--experimental');
      expect(PreferencesManager.INSTANCE.values().experimental_layout).is.false;
      expect(viewport.content).eq('width=1260, user-scalable=1');
      expect(wrapper.getComponent(WaitingFor).vm).eq(input);
    } finally {
      wrapper.unmount();
      viewport.remove();
    }
  });

  it('keeps the players keyboard shortcut reachable in the optional layout', async () => {
    PreferencesManager.INSTANCE.set('experimental_layout', true);
    const wrapper = mountLayoutPlayer();
    document.body.append(wrapper.element);
    try {
      document.body.dispatchEvent(new KeyboardEvent('keydown', {code: 'KeyS', bubbles: true}));
      await wrapper.vm.$nextTick();
      expect(wrapper.attributes('data-active-panel')).eq('players');
      expect(vi.mocked(Element.prototype.scrollIntoView).mock.calls.length).greaterThan(0);
    } finally {
      wrapper.unmount();
      wrapper.element.remove();
    }
  });

  it('opens the board for nested placement prompts and restores the viewport on unmount', async () => {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=1260, user-scalable=1';
    document.head.append(viewport);
    PreferencesManager.INSTANCE.set('experimental_layout', true);
    const wrapper = mountLayoutPlayer();
    try {
      wrapper.getComponent({name: 'ExperimentalPlayerNavigation'}).vm.$emit('navigate', 'cards');
      await wrapper.setProps({playerView: fakePlayerViewModel({thisPlayer: fakePublicPlayerModel({tableau: [{name: CardName.ECOLINE}]}), waitingFor: {
        type: 'and', title: 'Place a tile', buttonLabel: 'Save', options: [
          {type: 'space', title: 'Select space', buttonLabel: 'Save', spaces: []},
        ],
      }})});
      expect(wrapper.attributes('data-active-panel')).eq('board');
      expect(wrapper.classes()).include('player-home--placing');
    } finally {
      wrapper.unmount();
      expect(viewport.content).eq('width=1260, user-scalable=1');
      viewport.remove();
    }
  });
});
