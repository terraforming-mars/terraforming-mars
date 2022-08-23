
import {expect} from 'chai';
import {CallistoPenalMines} from '../../../src/server/cards/base/CallistoPenalMines';
import {TestPlayer} from '../../TestPlayer';

describe('CallistoPenalMines', function() {
  it('Should play', function() {
    const card = new CallistoPenalMines();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(3);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
