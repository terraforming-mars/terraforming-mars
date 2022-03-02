import {expect} from 'chai';
import {TradeAdvance} from '../../../src/cards/community/TradeAdvance';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('TradeAdvance', function() {
  let card : TradeAdvance; let player : Player; let game : Game;

  beforeEach(function() {
    card = new TradeAdvance();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({
      coloniesExtension: true,
      customColoniesList: [ColonyName.LUNA, ColonyName.CALLISTO, ColonyName.CERES, ColonyName.IO, ColonyName.TITAN],
    });
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player);

    TestingUtils.runAllActions(player.game);

    expect(player.megaCredits).to.eq(6); // 2 from card + 4 from Luna
    expect(player.energy).to.eq(3);
    expect(player.steel).to.eq(3);
    expect(player.heat).to.eq(4);
    game.colonies.forEach((colony) => {
      if (colony.isActive) {
        expect(colony.trackPosition).to.eq(0);
      } else {
        expect(colony.trackPosition).to.eq(1);
      }
    });
  });
});
