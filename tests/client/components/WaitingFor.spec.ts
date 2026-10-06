import {mount, shallowMount} from '@vue/test-utils';
import {defineComponent} from 'vue';
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
    vi.restoreAllMocks();
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

  it('waits for a slow poll before polling again', async () => {
    vi.useFakeTimers();
    let respond = () => {};
    const fetchStub = vi.fn(() => new Promise<Response>((resolve) => {
      respond = () => resolve({ok: true, json: async () => ({players: []})} as unknown as Response);
    }));
    vi.stubGlobal('fetch', fetchStub);
    mountDrafting(draftingView());

    await vi.advanceTimersByTimeAsync(10000);
    expect(fetchStub.mock.calls).has.length(1);

    respond();
    await vi.advanceTimersByTimeAsync(3500);
    expect(fetchStub.mock.calls).has.length(2);
  });

  it('stops polling after a client error', async () => {
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchStub = vi.fn(async () => ({ok: false, status: 404, statusText: 'Not Found'}) as Response);
    vi.stubGlobal('fetch', fetchStub);
    mountDrafting(draftingView());

    await vi.advanceTimersByTimeAsync(10000);

    expect(fetchStub.mock.calls).has.length(1);
  });

  it('keeps polling after a server error', async () => {
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchStub = vi.fn(async () => ({ok: false, status: 503, statusText: 'Service Unavailable'}) as Response);
    vi.stubGlobal('fetch', fetchStub);
    mountDrafting(draftingView());

    await vi.advanceTimersByTimeAsync(10000);

    expect(fetchStub.mock.calls).has.length(3);
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

  const PlayerInputFactoryStub = defineComponent({name: 'PlayerInputFactory', template: '<div class="stub-pif"></div>'});

  function stubXhr() {
    const urls: Array<string> = [];
    vi.stubGlobal('XMLHttpRequest', class {
      open(_method: string, url: string) {
        urls.push(url);
      }
      send() {}
    });
    return urls;
  }

  function mountWithInput(playerView: PlayerViewModel) {
    return mount(WaitingFor, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        stubs: {'PlayerInputFactory': PlayerInputFactoryStub},
      },
      props: {
        playerView,
        waitingfor: {type: 'option', title: 'test', buttonLabel: 'save'} as any,
      },
    });
  }

  it('remounts the input when the player view changes', async () => {
    const playerView = draftingView();
    playerView.game.phase = Phase.ACTION;
    const wrapper = mountWithInput(playerView);
    const input = wrapper.findComponent(PlayerInputFactoryStub).vm;

    await wrapper.setProps({playerView: {...playerView}});

    expect(wrapper.findComponent(PlayerInputFactoryStub).vm).to.not.eq(input);
  });

  it('starts polling when a new player view has nothing to do', async () => {
    vi.useFakeTimers();
    const urls = stubXhr();
    const playerView = draftingView();
    playerView.game.phase = Phase.ACTION;
    const wrapper = mountWithInput(playerView);

    await wrapper.setProps({playerView: {...playerView}, waitingfor: undefined});
    await vi.advanceTimersByTimeAsync(5000);

    expect(urls).has.length(1);
    expect(urls[0]).includes('api/waitingfor');
  });
});
