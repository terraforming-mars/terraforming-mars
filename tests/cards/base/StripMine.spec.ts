import {expect} from 'chai';
import {StripMine} from '../../../src/cards/base/StripMine';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';

describe('StripMine', function() {
  let card : StripMine; let player : Player; let game : Game;

  beforeEach(function() {
    card = new StripMine();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 2);
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(2);
  });
});
