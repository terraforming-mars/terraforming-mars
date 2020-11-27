
import {expect} from 'chai';
import {ConvoyFromEuropa} from '../../../src/cards/base/ConvoyFromEuropa';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';

describe('ConvoyFromEuropa', function() {
  it('Should play', function() {
    const card = new ConvoyFromEuropa();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    card.play(player, game);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
