import {expect} from 'chai';
import {TerraformingContract} from '../../../src/server/cards/venusNext/TerraformingContract';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('TerraformingContract', () => {
  it('Should play', () => {
    const card = new TerraformingContract();
    const [/* game */, player] = testGame(1);

    player.setTerraformRating(24);
    expect(card.canPlay(player)).is.not.true;
    player.setTerraformRating(25);
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(4);
  });
});
