import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {ValuableGases} from '../../../src/cards/community/preludes/ValuableGases';

describe('ValuableGases', function() {
  let card : ValuableGases; let player : Player; let game: Game;

  beforeEach(function() {
    card = new ValuableGases();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Should play', function() {
    card.play(player, game);
    expect(player.megaCredits).to.eq(6);
  });
});
