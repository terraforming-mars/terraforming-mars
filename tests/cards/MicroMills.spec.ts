
import {expect} from 'chai';
import {MicroMills} from '../../src/cards/MicroMills';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';

describe('MicroMills', function() {
  it('Should play', function() {
    const card = new MicroMills();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
  });
});
