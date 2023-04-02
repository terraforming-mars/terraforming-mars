import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {AdaptationTechnology} from '../../../src/server/cards/base/AdaptationTechnology';

describe('AdaptationTechnology', function() {
  it('Should play', function() {
    const [, player] = testGame(1);
    const card = new AdaptationTechnology();
    card.play(player);

    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(card.getRequirementBonus()).to.eq(2);
  });
});
