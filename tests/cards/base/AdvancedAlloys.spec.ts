import {expect} from 'chai';
import {AdvancedAlloys} from '../../../src/cards/base/AdvancedAlloys';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('AdvancedAlloys', function() {
  it('Should play', function() {
    const card = new AdvancedAlloys();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    card.play(player);
    expect(player.getTitaniumValue()).to.eq(4);
    expect(player.getSteelValue()).to.eq(3);
  });
});
