import {expect} from 'chai';
import {HeavyTaxation} from '../../../src/cards/colonies/HeavyTaxation';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('HeavyTaxation', function() {
  it('Should play', function() {
    const card = new HeavyTaxation();
    const player = TestPlayer.BLUE.newPlayer();
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(player.megaCredits).to.eq(4);
  });
});
