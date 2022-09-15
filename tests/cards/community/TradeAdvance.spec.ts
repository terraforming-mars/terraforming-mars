import {expect} from 'chai';
import {TradeAdvance} from '../../../src/server/cards/community/TradeAdvance';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('TradeAdvance', function() {
  let card: TradeAdvance;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new TradeAdvance();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const gameOptions = testGameOptions({
      coloniesExtension: true,
      customColoniesList: [ColonyName.LUNA, ColonyName.CALLISTO, ColonyName.CERES, ColonyName.IO, ColonyName.TITAN],
    });
    game = Game.newInstance('gameid', [player, redPlayer], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player);

    runAllActions(player.game);

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
