import {expect} from 'chai';

import {SelectPaymentDeferred} from '../../src/server/deferredActions/SelectPaymentDeferred';
import {SelectPayment} from '../../src/server/inputs/SelectPayment';
import {Payment} from '../../src/common/inputs/Payment';
import {testGame} from '../TestGame';
import {cast} from '@/common/utils/utils';

console.log('hello');

describe('SelectPaymentDeferred', () => {
  let paid: Payment | undefined = undefined;
  const cb = (payment: Payment) => paid = payment;
  it('pays nothing when the amount is zero', () => {
    const [/* game */, player] = testGame(1);
    player.megaCredits = 10;

    const action = new SelectPaymentDeferred(player, 0).andThen(cb);

    expect(action.execute()).is.undefined;
    expect(paid).deep.eq(Payment.EMPTY);
    expect(player.megaCredits).eq(10);
  });

  it('spends megacredits without asking when there is nothing else to spend', () => {
    const [/* game */, player] = testGame(1);
    player.megaCredits = 10;
    player.steel = 5;

    const action = new SelectPaymentDeferred(player, 4).andThen(cb);

    expect(action.execute()).is.undefined;
    expect(paid).deep.eq(Payment.of({megacredits: 4}));
    expect(player.megaCredits).eq(6);
    expect(player.steel).eq(5);
  });

  it('asks how to pay when a resource other than megacredits can be spent', () => {
    const [/* game */, player] = testGame(1);
    player.megaCredits = 10;
    player.steel = 5;

    const action = new SelectPaymentDeferred(player, 4, {canUseSteel: true})
      .andThen(cb);

    const selectPayment = cast(action.execute(), SelectPayment);
    expect(selectPayment.amount).eq(4);
    expect(selectPayment.paymentOptions.steel).is.true;
    expect(selectPayment.paymentOptions.titanium).is.false;

    // Nothing is spent until the player answers.
    expect(player.megaCredits).eq(10);
    expect(player.steel).eq(5);

    // One steel is worth 2 M€, so this covers the 4 M€ two ways at once.
    selectPayment.process({
      type: 'payment',
      payment: Payment.of({steel: 1, megacredits: 2}),
    }, player);

    expect(paid).deep.eq(Payment.of({steel: 1, megacredits: 2}));
    expect(player.megaCredits).eq(8);
    expect(player.steel).eq(4);
  });

  it('throws when the player cannot cover the cost', () => {
    const [/* game */, player] = testGame(1);
    player.megaCredits = 3;

    expect(() => new SelectPaymentDeferred(player, 4).execute()).to.throw(/does not have 4/);
  });
});
