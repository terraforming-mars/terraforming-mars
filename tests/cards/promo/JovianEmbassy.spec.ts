import {expect} from 'chai';
import {JovianEmbassy} from '../../../src/server/cards/promo/JovianEmbassy';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('JovianEmbassy', function() {
  it('Should play', function() {
    const card = new JovianEmbassy();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);

    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
