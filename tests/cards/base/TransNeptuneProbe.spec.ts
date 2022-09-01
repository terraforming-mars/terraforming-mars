import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TransNeptuneProbe} from '../../../src/server/cards/base/TransNeptuneProbe';

describe('TransNeptuneProbe', function() {
  it('Should play', function() {
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const card = new TransNeptuneProbe();
    const action = card.play(player);

    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
