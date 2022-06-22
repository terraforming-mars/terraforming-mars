import {expect} from 'chai';
import {TerraformingContract} from '../../../src/cards/venusNext/TerraformingContract';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('TerraformingContract', function() {
  it('Should play', function() {
    const card = new TerraformingContract();
    const player = TestPlayers.BLUE.newPlayer();
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
  });
});
