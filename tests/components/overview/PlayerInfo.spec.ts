import {mount} from '@vue/test-utils';
import {getLocalVue} from '../getLocalVue';
import {expect} from 'chai';
import {CardName} from '@/CardName';
import {Color} from '@/Color';
import PlayerInfo from '@/client/components/overview/PlayerInfo.vue';
import {PlayerViewModel, PublicPlayerModel} from '@/models/PlayerModel';
import {RecursivePartial} from '@/utils/utils';

describe('PlayerInfo', function() {
  it('Played card count test', function() {
    const thisPlayer: RecursivePartial<PublicPlayerModel> = {
      corporationCard: {
        name: CardName.HELION,
      },
      color: Color.BLUE,
      playedCards: [
        {
          name: CardName.ACQUIRED_COMPANY,
        },
        {
          name: CardName.BACTOVIRAL_RESEARCH,
        },
      ],
      victoryPointsBreakdown: {
        total: 1,
      },
      tags: [],
    };
    const playerView: RecursivePartial<PlayerViewModel> = {
      thisPlayer: thisPlayer,
      id: 'foobar',
      game: {
        gameOptions: {
          showTimers: false,
        },
      },
      players: [thisPlayer],
    };
    const playerStatus = mount(PlayerInfo, {
      localVue: getLocalVue(),
      parentComponent: {
        methods: {
          getVisibilityState: function() {},
        },
      },
      propsData: {
        player: thisPlayer,
        playerView: playerView,
        playerIndex: 0,
      },
    });
    const test = playerStatus.find('div[class*="played-cards-count"]');
    expect(test.text()).to.eq('2');
  });
});
