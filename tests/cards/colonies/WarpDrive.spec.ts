import {expect} from 'chai';
import {WarpDrive} from '../../../src/cards/colonies/WarpDrive';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TollStation} from '../../../src/cards/base/TollStation';

describe('WarpDrive', function() {
  it('Should play', function() {
    const card = new WarpDrive();
    const player = new Player('test', Color.BLUE, false);
    const player2 = new Player('test2', Color.RED, false);
    const game = new Game('foobar', [player, player2], player);
    expect(card.canPlay(player)).is.not.true;
    const action = card.play();
    expect(action).is.undefined;
    expect(card.getCardDiscount(player, game, new TollStation())).to.eq(4);
  });
});

