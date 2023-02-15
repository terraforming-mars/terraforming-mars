import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Psyche} from '../../../src/server/cards/promo/16Psyche';

describe('16 Psyche', function() {
  it('Should play', function() {
    const card = new Psyche();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);

    // Sanity
    expect(player.getVictoryPoints().victoryPoints).to.eq(0);
    player.playedCards.push(card);
    const action = card.play(player);
    expect(action).is.undefined;

    // Effect
    expect(player.production.titanium).to.eq(2);
    expect(player.titanium).to.eq(3);
    expect(player.getVictoryPoints().victoryPoints).to.eq(2);
  });
});
