import {expect} from 'chai';
import {Worms} from '../../../src/cards/base/Worms';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Worms', function() {
  let card: Worms;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new Worms();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    (game as any).oxygenLevel = 3;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 4;
    expect(player.canPlayIgnoringCost(card)).is.true;
    player.playedCards.push(card);

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
