import {expect} from 'chai';
import {TerraformingContract} from '../../../src/server/cards/venusNext/TerraformingContract';
import {testGame} from '../../TestGame';

describe('TerraformingContract', function() {
  it('Should play', function() {
    const card = new TerraformingContract();
    const [, player] = testGame(1);

    player.setTerraformRating(24);
    expect(player.simpleCanPlay(card)).is.not.true;
    player.setTerraformRating(25);
    expect(player.simpleCanPlay(card)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(4);
  });
});
