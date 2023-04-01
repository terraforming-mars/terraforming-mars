import {expect} from 'chai';
import {Pristar} from '../../../src/server/cards/turmoil/Pristar';
import {testGame} from '../../TestGame';

describe('Pristar', function() {
  it('Should play', function() {
    const card = new Pristar();
    const [game, player] = testGame(2);

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
