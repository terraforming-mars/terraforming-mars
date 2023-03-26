import {expect} from 'chai';
import {setOxygenLevel} from '../../TestingUtils';
import {Zeppelins} from '../../../src/server/cards/base/Zeppelins';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('Zeppelins', function() {
  let card: Zeppelins;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Zeppelins();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    setOxygenLevel(game, 4);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });
  it('Should play', function() {
    setOxygenLevel(game, 5);
    expect(player.canPlayIgnoringCost(card)).is.true;

    const lands = game.board.getAvailableSpacesOnLand(player);
    game.addCityTile(player, lands[0]);

    card.play(player);
    expect(player.production.megacredits).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
