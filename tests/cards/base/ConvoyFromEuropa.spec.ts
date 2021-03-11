import {expect} from 'chai';
import {ConvoyFromEuropa} from '../../../src/cards/base/ConvoyFromEuropa';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('ConvoyFromEuropa', function() {
  it('Should play', function() {
    const card = new ConvoyFromEuropa();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    card.play(player);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
