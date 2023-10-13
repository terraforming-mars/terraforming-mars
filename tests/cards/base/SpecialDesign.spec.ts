import {expect} from 'chai';
import {SpecialDesign} from '../../../src/server/cards/base/SpecialDesign';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('SpecialDesign', function() {
  it('Should play', function() {
    const card = new SpecialDesign();
    const [/* skipped */, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(card.getRequirementBonus(player)).to.eq(0);
  });
});
