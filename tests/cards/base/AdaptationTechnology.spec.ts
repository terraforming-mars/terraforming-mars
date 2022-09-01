import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {AdaptationTechnology} from '../../../src/server/cards/base/AdaptationTechnology';

describe('AdaptationTechnology', function() {
  it('Should play', function() {
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const card = new AdaptationTechnology();
    card.play(player);

    expect(card.getVictoryPoints()).to.eq(1);
    expect(card.getRequirementBonus()).to.eq(2);
  });
});
