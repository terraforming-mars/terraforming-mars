import {expect} from 'chai';
import {AdvancedAlloys} from '../../../src/server/cards/base/AdvancedAlloys';
import {testGame} from '../../TestGame';

describe('AdvancedAlloys', function() {
  it('Should play', function() {
    const card = new AdvancedAlloys();
    const [/* game */, player] = testGame(2);
    card.play(player);
    expect(player.getTitaniumValue()).to.eq(4);
    expect(player.getSteelValue()).to.eq(3);
  });
});
