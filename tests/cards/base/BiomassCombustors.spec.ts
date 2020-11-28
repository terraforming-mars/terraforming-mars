import {expect} from 'chai';
import {BiomassCombustors} from '../../../src/cards/base/BiomassCombustors';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';

describe('BiomassCombustors', function() {
  let card : BiomassCombustors; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new BiomassCombustors();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);
    game = new Game('foobar', [player, player2], player);
  });

  it('Cannot play if oxygen requirement not met', function() {
    player2.addProduction(Resources.PLANTS, 1);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Cannot play if no one has plant production', function() {
    (game as any).oxygenLevel = 6;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Can play in solo mode if oxygen requirement is met', function() {
    const game = new Game('foobar', [player], player);
    (game as any).oxygenLevel = 6;
    expect(card.canPlay(player, game)).is.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 6;
    player2.addProduction(Resources.PLANTS, 1);
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    const input = game.deferredActions.next()!.execute();
    expect(input).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    expect(player2.getProduction(Resources.PLANTS)).to.eq(0);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
  });
});
