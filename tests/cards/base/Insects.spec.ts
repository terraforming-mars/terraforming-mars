import {expect} from 'chai';
import {Insects} from '../../../src/cards/base/Insects';
import {Trees} from '../../../src/cards/base/Trees';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
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
    expect(player.getProduction(Resources.PLANTS)).to.eq(0);

    player.playedCards.push(new Trees());
    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
