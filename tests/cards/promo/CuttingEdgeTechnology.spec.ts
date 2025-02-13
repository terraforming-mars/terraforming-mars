import {expect} from 'chai';
import {DustSeals} from '../../../src/server/cards/base/DustSeals';
import {HeatTrappers} from '../../../src/server/cards/base/HeatTrappers';
import {CuttingEdgeTechnology} from '../../../src/server/cards/promo/CuttingEdgeTechnology';
import {VoteOfNoConfidence} from '../../../src/server/cards/turmoil/VoteOfNoConfidence';
import {testGame} from '../../TestGame';

describe('CuttingEdgeTechnology', () => {
  it('Should play', () => {
    const card = new CuttingEdgeTechnology();
    const [/* game */, player] = testGame(2);
    card.play(player);

    expect(card.getCardDiscount(player, new DustSeals())).to.eq(2);
    expect(card.getCardDiscount(player, new VoteOfNoConfidence())).to.eq(2);
    expect(card.getCardDiscount(player, new HeatTrappers())).to.eq(0);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
