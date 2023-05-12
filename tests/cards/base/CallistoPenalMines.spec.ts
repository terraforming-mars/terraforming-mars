
import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {CallistoPenalMines} from '../../../src/server/cards/base/CallistoPenalMines';

describe('CallistoPenalMines', function() {
  it('Should play', function() {
    const card = new CallistoPenalMines();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(3);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
