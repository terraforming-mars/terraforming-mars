import {expect} from 'chai';
import {AdvancedAlloys} from '@/server/cards/base/AdvancedAlloys';
import {testGame} from '@tests/TestGame';

describe('AdvancedAlloys', () => {
  it('Should play', () => {
    const card = new AdvancedAlloys();
    const [/* game */, player] = testGame(2);
    card.play(player);
    expect(player.getTitaniumValue()).to.eq(4);
    expect(player.getSteelValue()).to.eq(3);
  });
});
