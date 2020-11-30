
import {expect} from 'chai';
import {IceAsteroid} from '../../../src/cards/base/IceAsteroid';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';

describe('IceAsteroid', function() {
  it('Should play', function() {
    const card = new IceAsteroid();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
  });
});
