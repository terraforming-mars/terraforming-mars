import {shallowMount} from '@vue/test-utils';
import {globalConfig} from '../getLocalVue';
import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import PlayerInfo from '@/client/components/overview/PlayerInfo.vue';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {RecursivePartial} from '@/common/utils/utils';
import {fakeTimerModel} from '../testHelpers';

describe('PlayerInfo', () => {
  it('Played card count test', () => {
    const thisPlayer: RecursivePartial<PublicPlayerModel> = {
      color: 'blue',
      tableau: [
        {name: CardName.HELION},
        {name: CardName.ACQUIRED_COMPANY},
        {name: CardName.BACTOVIRAL_RESEARCH},
      ],
      timer: fakeTimerModel(),
      victoryPointsBreakdown: {
        total: 1,
      },
      tags: {},
    };
    const playerView: RecursivePartial<PlayerViewModel> = {
      thisPlayer: thisPlayer,
      id: 'playerid-foo',
      game: {
        gameOptions: {
          showTimers: false,
        },
      },
      players: [thisPlayer],
    };
    const playerInfo = shallowMount(PlayerInfo, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        mocks: {
          getVisibilityState: () => false,
          setVisibilityState: () => {},
          isServerSideRequestInProgress: false,
        },
      },
      props: {
        player: thisPlayer,
        playerView: playerView,
        playerIndex: 0,
      },
    });
    const test = playerInfo.find('div[class*="played-cards-count"]');
    expect(test.text()).to.eq('3');
  });
});
