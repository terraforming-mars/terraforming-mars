import {expect} from 'chai';
import {Insects} from '../../src/cards/Insects';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Trees} from '../../src/cards/Trees';
import {Resources} from '../../src/Resources';

describe('Insects', function() {
  let card : Insects; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Insects();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 6;
    expect(card.canPlay(player, game)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(0);

    player.playedCards.push(new Trees());
    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
