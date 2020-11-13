
import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {SmeltingPlant} from '../../../src/cards/prelude/SmeltingPlant';

describe('SmeltingPlant', function() {
  it('Should play', function() {
    const player = new Player('foo', Color.BLUE, false);
    const game = new Game('bar', [player], player);
    const card = new SmeltingPlant();
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.steel).to.eq(5);
    expect(game.getOxygenLevel()).to.eq(2);
  });
});
