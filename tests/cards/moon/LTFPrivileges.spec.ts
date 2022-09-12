import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LTFPrivileges} from '../../../src/server/cards/moon/LTFPrivileges';
import {expect} from 'chai';
import {CardName} from '../../../src/common/cards/CardName';
import {AristarchusRoadNetwork} from '../../../src/server/cards/moon/AristarchusRoadNetwork';

describe('LTFPrivileges', () => {
  let player: Player;
  let card: LTFPrivileges;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new LTFPrivileges();
  });


  it('effect', () => {
    // This test and the next show that Mare Sernaitatis needs a steel and 2 titanium.
    player.titanium = 2;
    player.steel = 2;
    player.megaCredits = 1000;

    const arn = new AristarchusRoadNetwork();
    player.cardsInHand = [arn];
    expect(player.getPlayableCards().map((card) => card.name)).deep.eq([CardName.ARISTARCHUS_ROAD_NETWORK]);

    player.titanium = 0;
    player.steel = 0;
    expect(player.getPlayableCards().map((card) => card.name)).is.empty;

    // And this one shows that with Improved Moon Concrete, doesn't need steel.
    player.playedCards = [card];
    expect(player.getPlayableCards().map((card) => card.name)).deep.eq([CardName.ARISTARCHUS_ROAD_NETWORK]);
  });
});

