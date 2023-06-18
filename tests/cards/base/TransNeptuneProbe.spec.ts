import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TransNeptuneProbe} from '../../../src/server/cards/base/TransNeptuneProbe';

describe('TransNeptuneProbe', function() {
  it('Should play', function() {
    const [, player] = testGame(1);
    const card = new TransNeptuneProbe();
    const action = card.play(player);

    cast(action, undefined);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
