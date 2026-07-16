import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {CallistoPenalMines} from '../../../src/server/cards/base/CallistoPenalMines';
import {cast} from '../../TestingUtils';

describe('CallistoPenalMines', () => {
  it('Should play', () => {
    const card = new CallistoPenalMines();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(3);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
