
import {expect} from 'chai';
import {MineralDeposit} from '../../src/cards/MineralDeposit';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';

describe('MineralDeposit', function() {
  it('Should play', function() {
    const card = new MineralDeposit();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.steel).to.eq(5);
  });
});
