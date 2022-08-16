import {expect} from 'chai';
import {Windmills} from '../../../src/server/cards/base/Windmills';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

describe('Windmills', function() {
  let card: Windmills;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Windmills();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    (game as any).oxygenLevel = 6;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });
  it('Should play', function() {
    (game as any).oxygenLevel = 7;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
