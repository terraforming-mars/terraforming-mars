import {expect} from 'chai';
import {SpecialDesign} from '../../../src/server/cards/base/SpecialDesign';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {GlobalParameter} from '../../../src/common/GlobalParameter';
import {CardName} from '../../../src/common/cards/CardName';

describe('SpecialDesign', function() {
  it('Should play', function() {
    const card = new SpecialDesign();
    const [/* skipped */, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(card.getGlobalParameterRequirementBonus(player, GlobalParameter.TEMPERATURE)).to.eq(0);
    player.lastCardPlayed = card.name;
    expect(card.getGlobalParameterRequirementBonus(player, GlobalParameter.TEMPERATURE)).to.eq(2);
    player.lastCardPlayed = CardName.MICROBIOLOGY_PATENTS;
    expect(card.getGlobalParameterRequirementBonus(player, GlobalParameter.TEMPERATURE)).to.eq(0);
  });
});
