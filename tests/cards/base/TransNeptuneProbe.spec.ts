
import {expect} from 'chai';
import {TransNeptuneProbe} from '../../../src/cards/base/TransNeptuneProbe';

describe('TransNeptuneProbe', function() {
  it('Should play', function() {
    const card = new TransNeptuneProbe();
    const action = card.play();
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
