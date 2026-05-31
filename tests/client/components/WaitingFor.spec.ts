import {shallowMount} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
import {expect} from 'chai';
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
          'player-input-factory': {template: '<div class="stub-pif"></div>'},
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
          'player-input-factory': true,
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

  it('shows cancel action for nested active action prompts when undo is enabled', () => {
    const wrapper = shallowMount(WaitingFor, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        stubs: {
          'player-input-factory': {template: '<div class="stub-pif"></div>'},
          'AppButton': {props: ['title'], template: '<button>{{ title }}</button>'},
        },
      },
      props: {
        playerView: {
          ...playerView,
          thisPlayer: {...thisPlayer, isActive: true},
          game: {
            ...playerView.game,
            gameOptions: {undoOption: true},
          },
        } as PlayerViewModel,
        waitingfor: {
          type: 'card',
          title: 'Choose a card',
          buttonLabel: 'Choose',
          cards: [],
          min: 1,
          max: 1,
        },
      },
    });

    expect(wrapper.text()).to.include('Cancel action');
  });

  it('does not show cancel action on the main action prompt', () => {
    const wrapper = shallowMount(WaitingFor, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        stubs: {
          'player-input-factory': {template: '<div class="stub-pif"></div>'},
          'AppButton': {props: ['title'], template: '<button>{{ title }}</button>'},
        },
      },
      props: {
        playerView: {
          ...playerView,
          thisPlayer: {...thisPlayer, isActive: true},
          game: {
            ...playerView.game,
            gameOptions: {undoOption: true},
          },
        } as PlayerViewModel,
        waitingfor: {
          type: 'or',
          title: 'Take your next action',
          buttonLabel: 'Take action',
          options: [],
        },
      },
    });

    expect(wrapper.text()).to.not.include('Cancel action');
  });

  it('shows cancel action for nested active action option prompts when undo is enabled', () => {
    const wrapper = shallowMount(WaitingFor, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        stubs: {
          'player-input-factory': {template: '<div class="stub-pif"></div>'},
          'AppButton': {props: ['title'], template: '<button>{{ title }}</button>'},
        },
      },
      props: {
        playerView: {
          ...playerView,
          thisPlayer: {...thisPlayer, isActive: true},
          game: {
            ...playerView.game,
            gameOptions: {undoOption: true},
          },
        } as PlayerViewModel,
        waitingfor: {
          type: 'or',
          title: 'Select one option',
          buttonLabel: 'Confirm',
          options: [],
        },
      },
    });

    expect(wrapper.text()).to.include('Cancel action');
  });
});
