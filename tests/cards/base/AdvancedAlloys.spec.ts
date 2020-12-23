import {expect} from 'chai';
import {AdvancedAlloys} from '../../../src/cards/base/AdvancedAlloys';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('AdvancedAlloys', function() {
  it('Should play', function() {
    const card = new AdvancedAlloys();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    card.play(player);
    expect(player.getTitaniumValue(game)).to.eq(4);
    expect(player.getSteelValue()).to.eq(3);
  });
});
