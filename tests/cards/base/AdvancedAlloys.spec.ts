import {expect} from 'chai';
import {AdvancedAlloys} from '../../../src/cards/base/AdvancedAlloys';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('AdvancedAlloys', function() {
  it('Should play', function() {
    const card = new AdvancedAlloys();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    card.play(player);
    expect(player.getTitaniumValue(game)).to.eq(4);
    expect(player.getSteelValue(game)).to.eq(3);
  });
});
