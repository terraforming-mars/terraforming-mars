import {expect} from 'chai';
import {Aphrodite} from '../../../src/server/cards/venusNext/Aphrodite';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('Aphrodite', function() {
  it('Should play', function() {
    const card = new Aphrodite();
    const [game, player, player2] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.production.plants).to.eq(1);
    player.corporations.push(card);
    expect(player.megaCredits).to.eq(0);
    game.increaseVenusScaleLevel(player2, 2);
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.megaCredits).to.eq(4);
  });
});
