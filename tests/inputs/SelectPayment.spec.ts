import {expect} from 'chai';
import {SelectPayment} from '../../src/server/inputs/SelectPayment';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {Payment} from '../../src/common/inputs/Payment';

describe('SelectPayment', function() {
  let player: TestPlayer;
  let selected: Payment | undefined;
  const cb = (payment: Payment | undefined) => {
    selected = payment;
    return undefined;
  };

  beforeEach(() => {
    [/* game */, player] = testGame(1);
  });

  it('Simple', function() {
    player.megaCredits = 10;
    const selectPayment = new SelectPayment('', 10, {}).andThen(cb);

    selectPayment.process({type: 'payment', payment: Payment.of({megaCredits: 10})}, player);
    expect(selected).deep.eq(Payment.of({megaCredits: 10}));

    player.megaCredits = 9;
    expect(() => selectPayment.process({type: 'payment', payment: Payment.of({megaCredits: 10})}, player))
      .to.throw(/You do not have that many resources/);
  });

  it('Simple, can pay with steel', function() {
    player.megaCredits = 6;
    player.steel = 2;
    const selectPayment = new SelectPayment('', 10, {steel: true}).andThen(cb);

    selectPayment.process({type: 'payment', payment: Payment.of({megaCredits: 6, steel: 2})}, player);
    expect(selected).deep.eq(Payment.of({megaCredits: 6, steel: 2}));
  });
});
