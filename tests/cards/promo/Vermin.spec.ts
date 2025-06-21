import {expect} from 'chai';
import {Vermin} from '../../../src/server/cards/promo/Vermin';
import {testGame} from '../../TestGame';
import {addCity, addGreenery} from '../../TestingUtils';
import {IPlayer} from '../../../src/server/IPlayer';
import {CardName} from '../../../src/common/cards/CardName';

describe('Vermin', () => {
  it('Effect', () => {
    const card = new Vermin();
    const [/* game */, player, player2] = testGame(2);
    player.playedCards.push(card);

    addCity(player);
    expect(card.resourceCount).eq(1);

    addCity(player2);
    expect(card.resourceCount).eq(2);

    addGreenery(player);
    expect(card.resourceCount).eq(2);
  });

  it('action', () => {
    const card = new Vermin();
    const [/* game */, player] = testGame(1);
    player.playedCards.push(card);

    expect(card.canAct(player)).is.true;
  });

  it('VP', () => {
    const card = new Vermin();
    const [/* game */, player, player2] = testGame(2);
    player.playedCards.push(card);

    addCity(player);
    addCity(player);
    addCity(player);

    addCity(player2);
    addCity(player2);
    addCity(player2);
    addCity(player2);

    expect(card.resourceCount).eq(7);

    card.resourceCount = 9;

    const getVp = (p: IPlayer) => {
      const entries = p.getVictoryPoints().detailsCards.filter((entry) => entry.cardName === CardName.VERMIN);
      if (entries.length > 1) {
        throw new Error('Too many Vermin entries');
      }
      return entries.length === 1 ? entries[0].victoryPoint : 0;
    };

    expect(getVp(player)).eq(0);
    expect(getVp(player2)).eq(0);

    player.addResourceTo(card);
    expect(card.resourceCount).eq(10);

    expect(getVp(player)).eq(-3);
    expect(getVp(player2)).eq(-4);

    player.removeResourceFrom(card);
    expect(card.resourceCount).eq(9);

    expect(getVp(player)).eq(0);
    expect(getVp(player2)).eq(0);
  });
});
