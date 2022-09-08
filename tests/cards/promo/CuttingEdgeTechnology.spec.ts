import {expect} from 'chai';
import {DustSeals} from '../../../src/server/cards/base/DustSeals';
import {HeatTrappers} from '../../../src/server/cards/base/HeatTrappers';
import {CuttingEdgeTechnology} from '../../../src/server/cards/promo/CuttingEdgeTechnology';
import {VoteOfNoConfidence} from '../../../src/server/cards/turmoil/VoteOfNoConfidence';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('CuttingEdgeTechnology', function() {
  it('Should play', function() {
    const card = new CuttingEdgeTechnology();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    card.play(player);

    const discountedCard = new DustSeals();
    const discountedCard2 = new VoteOfNoConfidence();
    const undiscountedCard = new HeatTrappers();

    expect(card.getCardDiscount(player, discountedCard)).to.eq(2);
    expect(card.getCardDiscount(player, discountedCard2)).to.eq(2);
    expect(card.getCardDiscount(player, undiscountedCard)).to.eq(0);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
