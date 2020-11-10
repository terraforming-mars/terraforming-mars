import {expect} from 'chai';
import {RimFreighters} from '../../../src/cards/colonies/RimFreighters';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Ceres} from '../../../src/colonies/Ceres';

describe('RimFreighters', function() {
  it('Should play', function() {
    const card = new RimFreighters();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player);
    expect(action).is.undefined;
    const ceres = new Ceres();
    ceres.trade(player, game);
    expect(player.steel).to.eq(2);
  });
});
