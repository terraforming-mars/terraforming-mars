import {expect} from 'chai';
import {Windmills} from '../../../src/cards/base/Windmills';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Windmills', function() {
  let card : Windmills; let player : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new Windmills();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
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
