import {expect} from 'chai';
import {Windmills} from '../../../src/cards/base/Windmills';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Windmills', function() {
  let card : Windmills; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Windmills();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    (game as any).oxygenLevel = 6;
    expect(card.canPlay(player, game)).is.not.true;
  });
  it('Should play', function() {
    (game as any).oxygenLevel = 7;
    expect(card.canPlay(player, game)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
