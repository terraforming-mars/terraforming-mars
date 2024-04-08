import {expect} from 'chai';
import {ConvoyFromEuropa} from '../../../src/server/cards/base/ConvoyFromEuropa';
import {testGame} from '../../TestGame';

describe('ConvoyFromEuropa', function() {
  it('Should play', function() {
    const card = new ConvoyFromEuropa();
    const [/* game */, player] = testGame(2);
    card.play(player);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
