import {expect} from 'chai';
import {ConvoyFromEuropa} from '../../../src/server/cards/base/ConvoyFromEuropa';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('ConvoyFromEuropa', function() {
  it('Should play', function() {
    const card = new ConvoyFromEuropa();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    card.play(player);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
