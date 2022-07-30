import {expect} from 'chai';
import {MethaneFromTitan} from '../../../src/cards/base/MethaneFromTitan';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

describe('MethaneFromTitan', function() {
  let card: MethaneFromTitan;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new MethaneFromTitan();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 2;
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.HEAT)).to.eq(2);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
