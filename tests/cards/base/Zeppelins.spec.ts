import {expect} from 'chai';
import {Zeppelins} from '../../../src/cards/base/Zeppelins';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

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
    (game as any).oxygenLevel = 4;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });
  it('Should play', function() {
    (game as any).oxygenLevel = 5;
    expect(player.canPlayIgnoringCost(card)).is.true;

    const lands = game.board.getAvailableSpacesOnLand(player);
    game.addCityTile(player, lands[0].id);

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
