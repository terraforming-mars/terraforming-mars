
import {expect} from 'chai';
import {ProtectedHabitats} from '../../../src/cards/base/ProtectedHabitats';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';

describe('ProtectedHabitats', function() {
  it('Should play', function() {
    const card = new ProtectedHabitats();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    expect(card.play(player, game)).is.undefined;
  });
});
