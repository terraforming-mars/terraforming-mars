import {expect} from 'chai';
import {SpecialDesign} from '../../../src/server/cards/base/SpecialDesign';
import {testGame} from '../../TestGame';

describe('SpecialDesign', function() {
  it('Should play', function() {
    const card = new SpecialDesign();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getRequirementBonus(player)).to.eq(0);
  });
});
