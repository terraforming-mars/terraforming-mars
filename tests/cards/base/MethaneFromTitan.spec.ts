import {expect} from 'chai';
import {MethaneFromTitan} from '../../../src/cards/base/MethaneFromTitan';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('MethaneFromTitan', function() {
  let card : MethaneFromTitan; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MethaneFromTitan();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 2;
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.HEAT)).to.eq(2);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });
});
