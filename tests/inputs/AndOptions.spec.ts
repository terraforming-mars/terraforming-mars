import {expect} from 'chai';
import {testGame} from '../TestGame';
import {AndOptions} from '../../src/server/inputs/AndOptions';
import {TestPlayer} from '../TestPlayer';
import {SelectAmount} from '../../src/server/inputs/SelectAmount';

describe('AndOptions', function() {
  let player: TestPlayer;
  let called = false;
  const vals = <Array<number>>[];
  function cb() {
    called = true;
    return undefined;
  }
  function amountCb(val: number) {
    vals.push(val);
    return undefined;
  }

  beforeEach(() => {
    [/* skipped */, player] = testGame(1);
  });

  it('Simple', function() {
    const andOptions = new AndOptions(
      new SelectAmount('', '', 0, 10).andThen(amountCb),
      new SelectAmount('', '', 0, 10).andThen(amountCb),
      new SelectAmount('', '', 0, 10).andThen(amountCb),
    ).andThen(cb);

    expect(andOptions.options).has.length(3);

    andOptions.process({
      type: 'and',
      responses: [
        {type: 'amount', amount: 2},
        {type: 'amount', amount: 3},
        {type: 'amount', amount: 4},
      ]},
    player);
    expect(called).is.true;
    expect(vals).deep.eq([2, 3, 4]);

    expect(() => {
      andOptions.process({
        type: 'and',
        responses: [
          {type: 'amount', amount: 2},
          {type: 'amount', amount: 4},
        ]},
      player);
    })
      .to.throw(/Incorrect options provided/);

    expect(() => {
      andOptions.process({
        type: 'and',
        responses: [
          {type: 'amount', amount: 2},
          {type: 'amount', amount: 3},
          {type: 'amount', amount: 4},
          {type: 'amount', amount: 5},
        ]},
      player);
    })
      .to.throw(/Incorrect options provided/);
  });
});
