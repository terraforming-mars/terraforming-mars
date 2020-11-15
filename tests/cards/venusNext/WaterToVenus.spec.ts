import {expect} from 'chai';
import {WaterToVenus} from '../../../src/cards/venusNext/WaterToVenus';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';

describe('WaterToVenus', function() {
  it('Should play', function() {
    const card = new WaterToVenus();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);

    const play = card.play(player, game);
    expect(play).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
