
import {expect} from 'chai';
import {TowingAComet} from '../../../src/cards/base/TowingAComet';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';

describe('TowingAComet', function() {
  it('Should play', function() {
    const card = new TowingAComet();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    card.play(player, game);
    expect(player.plants).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
