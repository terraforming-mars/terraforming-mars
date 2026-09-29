import {mount, shallowMount} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
import {expect} from 'chai';
import {afterEach, vi} from 'vitest';
import WaitingFor from '@/client/components/WaitingFor.vue';
import {RecursivePartial} from '@/common/utils/utils';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {Phase} from '@/common/Phase';

describe('WaitingFor', () => {
  const thisPlayer: Partial<PublicPlayerModel> = {
    color: 'red',
  } as any;

  const playerView: RecursivePartial<PlayerViewModel> = {
    id: 'p-player-id',
    thisPlayer: thisPlayer as PublicPlayerModel,
    players: [thisPlayer as PublicPlayerModel],
    game: {
      phase: Phase.ACTION,
      gameAge: 1,
      undoCount: 0,
    },
  };

  it('renders player-input-factory when waitingfor is provided', () => {
    const wrapper = shallowMount(WaitingFor, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        stubs: {
          'PlayerInputFactory': {template: '<div class="stub-pif"></div>'},
        },
      },
      props: {
        playerView: playerView as PlayerViewModel,
        players: [thisPlayer as PublicPlayerModel],
        waitingfor: {
          type: 'option',
          title: 'test',
          buttonLabel: 'save',
        },
      },
    });
    expect(wrapper.find('.stub-pif').exists()).to.be.true;
    expect(wrapper.text()).to.not.include('Not your turn');
  });

  it('shows "not your turn" when waitingfor is undefined', () => {
    const wrapper = shallowMount(WaitingFor, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        stubs: {
          'PlayerInputFactory': true,
        },
      },
      props: {
        playerView: playerView as PlayerViewModel,
        players: [thisPlayer as PublicPlayerModel],
        waitingfor: undefined,
      },
    });
    expect(wrapper.text()).to.include('Not your turn');
  });

  const draftingView = (): PlayerViewModel => ({
    id: 'p-player-id',
    thisPlayer: {color: 'red'},
    players: [{color: 'red', needsToDraft: true}, {color: 'blue', needsToDraft: true}],
    game: {phase: Phase.DRAFTING, gameAge: 1, undoCount: 0},
  }) as unknown as PlayerViewModel;

  function mountDrafting(playerView: PlayerViewModel) {
    return mount(WaitingFor, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        stubs: {'PlayerInputFactory': {template: '<div class="stub-pif"></div>'}},
      },
      props: {
        playerView,
        waitingfor: {type: 'card', title: 'Select a card', buttonLabel: 'Select'} as any,
      },
    });
  }

  function stubServer(players: Array<unknown>) {
    const fetchStub = vi.fn(async () => ({ok: true, json: async () => ({players})}) as Response);
    vi.stubGlobal('fetch', fetchStub);
    return fetchStub;
  }

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('updates other players while drafting', async () => {
    vi.useFakeTimers();
    const updatedPlayers = [{color: 'red', needsToDraft: true}, {color: 'blue', needsToDraft: false}];
    stubServer(updatedPlayers);
    const playerView = draftingView();
    const wrapper = mountDrafting(playerView);

    await vi.advanceTimersByTimeAsync(3500);

    expect(playerView.players).deep.eq(updatedPlayers);
    expect(wrapper.find('.stub-pif').exists()).to.be.true;
  });

  it('does not watch other players during the action phase', async () => {
    vi.useFakeTimers();
    const fetchStub = stubServer([]);
    const playerView = draftingView();
    playerView.game.phase = Phase.ACTION;
    mountDrafting(playerView);

    await vi.advanceTimersByTimeAsync(3500);

    expect(fetchStub.mock.calls).is.empty;
  });
});
