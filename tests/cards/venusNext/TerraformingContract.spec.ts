import {expect} from 'chai';
import {TerraformingContract} from '../../../src/server/cards/venusNext/TerraformingContract';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('TerraformingContract', function() {
  it('Should play', function() {
    const card = new TerraformingContract();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);

    player.setTerraformRating(24);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    player.setTerraformRating(25);
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(4);
  });
});
