import {expect} from 'chai';
import {TerraformingContract} from '../../../src/server/cards/venusNext/TerraformingContract';
import {TestPlayer} from '../../TestPlayer';

describe('TerraformingContract', function() {
  it('Should play', function() {
    const card = new TerraformingContract();
    const player = TestPlayer.BLUE.newPlayer();
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(4);
  });
});
