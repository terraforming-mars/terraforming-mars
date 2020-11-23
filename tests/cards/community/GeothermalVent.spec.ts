import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {GeothermalVent} from '../../../src/cards/community/GeothermalVent';
import {Game} from '../../../src/Game';

describe('GeothermalVent', function() {
  let card : GeothermalVent; let player : Player; let game: Game;

  beforeEach(function() {
    card = new GeothermalVent();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Should play', function() {
    const initialTR = player.getTerraformRating();
    card.play(player, game);

    expect(player.getProduction(Resources.HEAT)).to.eq(2);
    expect(game.getTemperature()).to.eq(-26);
    expect(player.getTerraformRating()).to.eq(initialTR + 2);
  });
});
