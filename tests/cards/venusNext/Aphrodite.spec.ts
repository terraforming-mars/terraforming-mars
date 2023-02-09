import {expect} from 'chai';
import {Aphrodite} from '../../../src/server/cards/venusNext/Aphrodite';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Aphrodite', function() {
  it('Should play', function() {
    const card = new Aphrodite();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    const player2 = getTestPlayer(game, 1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.plants).to.eq(1);
    player.setCorporationForTest(card);
    expect(player.megaCredits).to.eq(0);
    game.increaseVenusScaleLevel(player2, 2);
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.megaCredits).to.eq(4);
  });
});
