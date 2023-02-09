
import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CallistoPenalMines} from '../../../src/server/cards/base/CallistoPenalMines';

describe('CallistoPenalMines', function() {
  it('Should play', function() {
    const card = new CallistoPenalMines();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(3);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
