import {expect} from 'chai';
import {ConvoyFromEuropa} from '../../../src/cards/base/ConvoyFromEuropa';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('ConvoyFromEuropa', function() {
  it('Should play', function() {
    const card = new ConvoyFromEuropa();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    card.play(player, game);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
