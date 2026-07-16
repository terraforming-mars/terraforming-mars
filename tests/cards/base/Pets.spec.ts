import {expect} from 'chai';
import {Pets} from '../../../src/server/cards/base/Pets';
import {addCity, runAllActions, testGame} from '../../TestingUtils';
import {cast} from '../../TestingUtils';

describe('Pets', () => {
  it('Should play', () => {
    const card = new Pets();
    const [game, player] = testGame(1);
    player.playedCards.push(card);
    cast(card.play(player), undefined);
    player.addResourceTo(card, 4);
    expect(card.getVictoryPoints(player)).to.eq(2);
    addCity(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(6);
  });
});
