import {expect} from 'chai';
import {MethaneFromTitan} from '../../../src/server/cards/base/MethaneFromTitan';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

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

    expect(player.production.heat).to.eq(2);
    expect(player.production.plants).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
