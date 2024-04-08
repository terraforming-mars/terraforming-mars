import {expect} from 'chai';
import {JovianEmbassy} from '../../../src/server/cards/promo/JovianEmbassy';
import {testGame} from '../../TestGame';

describe('JovianEmbassy', function() {
  it('Should play', function() {
    const card = new JovianEmbassy();
    const [/* game */, player] = testGame(2);

    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
