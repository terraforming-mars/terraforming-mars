import {expect} from 'chai';
import {AdvancedAlloys} from '../../../src/server/cards/base/AdvancedAlloys';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('AdvancedAlloys', function() {
  it('Should play', function() {
    const card = new AdvancedAlloys();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    card.play(player);
    expect(player.getTitaniumValue()).to.eq(4);
    expect(player.getSteelValue()).to.eq(3);
  });
});
