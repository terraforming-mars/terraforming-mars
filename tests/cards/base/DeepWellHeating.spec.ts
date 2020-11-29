
import {expect} from 'chai';
import {DeepWellHeating} from '../../../src/cards/base/DeepWellHeating';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';

describe('DeepWellHeating', function() {
  it('Should play', function() {
    const card = new DeepWellHeating();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(game.getTemperature()).to.eq(-28);
  });
});
