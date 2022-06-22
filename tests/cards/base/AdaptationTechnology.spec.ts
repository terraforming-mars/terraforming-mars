
import {expect} from 'chai';
import {AdaptationTechnology} from '../../../src/cards/base/AdaptationTechnology';

describe('AdaptationTechnology', function() {
  it('Should play', function() {
    const card = new AdaptationTechnology();

    card.play();
    expect(card.getVictoryPoints()).to.eq(1);
    expect(card.getRequirementBonus()).to.eq(2);
  });
});
