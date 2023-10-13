import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Psyche} from '../../../src/server/cards/promo/16Psyche';
import {cast} from '../../TestingUtils';

describe('16 Psyche', function() {
  it('Should play', function() {
    const card = new Psyche();
    const [/* skipped */, player] = testGame(1);

    // Sanity
    expect(player.getVictoryPoints().victoryPoints).to.eq(0);
    player.playedCards.push(card);
    cast(card.play(player), undefined);
    // Effect
    expect(player.production.titanium).to.eq(2);
    expect(player.titanium).to.eq(3);
    expect(player.getVictoryPoints().victoryPoints).to.eq(2);
  });
});
