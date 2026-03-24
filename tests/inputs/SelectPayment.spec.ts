import {expect} from 'chai';
import {SelectPayment} from '../../src/server/inputs/SelectPayment';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {Payment} from '../../src/common/inputs/Payment';
import {Units} from '../../src/common/Units';

describe('SelectPayment', () => {
  let player: TestPlayer;
  let selected: Payment | undefined;
  const cb = (payment: Payment | undefined) => {
    selected = payment;
    return undefined;
  };

  beforeEach(() => {
    [/* game */, player] = testGame(1);
  });

  it('Simple', () => {
    player.megaCredits = 10;
    const selectPayment = new SelectPayment('', 10, {}).andThen(cb);

    selectPayment.process({type: 'payment', payment: Payment.of({megaCredits: 10})}, player);
    expect(selected).deep.eq(Payment.of({megaCredits: 10}));

    player.megaCredits = 9;
    expect(() => selectPayment.process({type: 'payment', payment: Payment.of({megaCredits: 10})}, player))
      .to.throw(/You do not have that many resources/);
  });

  it('Simple, can pay with steel', () => {
    player.megaCredits = 6;
    player.steel = 2;
    const selectPayment = new SelectPayment('', 10, {steel: true}).andThen(cb);

    selectPayment.process({type: 'payment', payment: Payment.of({megaCredits: 6, steel: 2})}, player);
    expect(selected).deep.eq(Payment.of({megaCredits: 6, steel: 2}));
  });

  for (const run of [
    {mc: 10, titanium: 2, heat: 2, corp: undefined, payment: {megaCredits: 8}, expected: true},
    {mc: 9, titanium: 2, heat: 2, corp: undefined, payment: {megaCredits: 8}, expected: false},
    {mc: 8, titanium: 2, heat: 4, corp: 'helion', payment: {megaCredits: 6, heat: 2}, expected: true},
    {mc: 8, titanium: 2, heat: 4, corp: 'helion', payment: {megaCredits: 7, heat: 1}, expected: false},
    {mc: 8, titanium: 2, heat: 4, corp: 'helion', payment: {megaCredits: 5, heat: 3}, expected: false},
    {mc: 8, titanium: 4, heat: 2, corp: 'lunaTradeFederation', payment: {megaCredits: 6, titanium: 2}, expected: true},
    {mc: 8, titanium: 4, heat: 2, corp: 'lunaTradeFederation', payment: {megaCredits: 7, titanium: 1}, expected: false},
    {mc: 8, titanium: 4, heat: 2, corp: 'lunaTradeFederation', payment: {megaCredits: 5, titanium: 3}, expected: false},
  ] as const) {
    it('Reserve Units: ' + JSON.stringify(run), () => {
      const reserveUnits: Units = Units.every(2);
      player.stock.override({
        ...Units.every(2),
        megacredits: run.mc,
        titanium: run.titanium,
        heat: run.heat});

      if (run.corp === 'helion') {
        player.canUseHeatAsMegaCredits = true;
      }
      if (run.corp === 'lunaTradeFederation') {
        player.canUseTitaniumAsMegacredits = true;
      }

      const selectPayment = new SelectPayment('', 8, {}, reserveUnits).andThen(cb);

      if (run.expected) {
        selectPayment.process({type: 'payment', payment: Payment.of(run.payment)}, player);
        expect(selected).deep.eq(Payment.of(run.payment));
      } else {
        expect(() => selectPayment.process({type: 'payment', payment: Payment.of(run.payment)}, player))
          .to.throw(/You do not have that many resources/);
      }
    });
  }
});
