import {expect} from 'chai';
import {Pristar} from '../../../src/server/cards/turmoil/Pristar';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Pristar', function() {
  it('Should play', function() {
    const card = new Pristar();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);

    const play = card.play(player);
    player.setCorporationForTest(card);
    expect(play).is.undefined;
    player.megaCredits = 10;
    game.increaseTemperature(player, 1);
    card.onProductionPhase(player);
    expect(player.megaCredits).to.eq(10);
    expect(card.resourceCount).to.eq(0);
  });
});
