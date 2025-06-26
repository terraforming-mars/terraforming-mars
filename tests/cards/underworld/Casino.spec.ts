import {expect} from 'chai';
import {Casino} from '../../../src/server/cards/underworld/Casino';
import {testGame} from '../../TestGame';
import {addCity, cast} from '../../TestingUtils';

describe('Casino', () => {
  it('canPlay', () => {
    const card = new Casino();
    const [/* game */, player, player2] = testGame(2);

    player.underworldData.corruption = 0;

    expect(card.canPlay(player)).is.false;

    addCity(player2);

    expect(card.canPlay(player)).is.true;
    expect(card.canPlay(player2)).is.true;
  });

  it('Should play', () => {
    const card = new Casino();
    const [/* game */, player] = testGame(2);

    player.underworldData.corruption = 0;

    cast(card.play(player), undefined);

    expect(player.underworldData.corruption).to.eq(1);
    expect(player.production.megacredits).eq(2);
  });
});
