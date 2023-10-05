import {expect} from 'chai';
import {SelectAmount} from '../../src/server/inputs/SelectAmount';

describe('', () => {
  let selected: number | undefined;

  const cb = (amount: number) => {
    selected = amount;
    return undefined;
  };

  beforeEach(() => {
    selected = undefined;
  });

  it('Simple', () => {
    const selectAmount = new SelectAmount('', '', 3, 100, true).andThen(cb);
    selectAmount.process({type: 'amount', amount: 3});
    expect(selected).eq(3);
    selectAmount.process({type: 'amount', amount: 20});
    expect(selected).eq(20);
    selectAmount.process({type: 'amount', amount: 100});
    expect(selected).eq(100);
  });

  it('Cannot select invalid amount', () => {
    const selectAmount = new SelectAmount('', '', 3, 100, true).andThen(cb);
    expect(() => selectAmount.process({type: 'amount', amount: 2}))
      .to.throw(Error, /too low/);
    expect(() => selectAmount.process({type: 'amount', amount: 101}))
      .to.throw(Error, /too high/);
  });
});
