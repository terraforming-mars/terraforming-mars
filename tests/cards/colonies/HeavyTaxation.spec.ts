import {expect} from 'chai';
import {HeavyTaxation} from '../../../src/cards/colonies/HeavyTaxation';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('HeavyTaxation', function() {
  it('Should play', function() {
    const card = new HeavyTaxation();
    const player = TestPlayers.BLUE.newPlayer();
    expect(card.canPlay(player)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(player.megaCredits).to.eq(4);
  });
});
