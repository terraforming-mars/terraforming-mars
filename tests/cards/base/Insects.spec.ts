import {expect} from 'chai';
import {Insects} from '../../../src/server/cards/base/Insects';
import {Trees} from '../../../src/server/cards/base/Trees';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Insects', function() {
  let card: Insects;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new Insects();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 6;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(0);

    player.playedCards.push(new Trees());
    card.play(player);
    expect(player.production.plants).to.eq(1);
  });
});
