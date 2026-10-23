import {expect} from 'chai';
import {IGame} from '@/server/IGame';
import {testGame} from '../TestGame';
import {Merchant3} from '@/server/milestones/Merchant3';
import {TestPlayer} from '@tests/TestPlayer';
import {runAllActions} from '@tests/TestingUtils';
import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectOption} from '@/server/inputs/SelectOption';
import {SelectPayment} from '@/server/inputs/SelectPayment';
import {Payment} from '@/common/inputs/Payment';
import {cast} from '@/common/utils/utils';

describe('Merchant3', () => {
  let game: IGame;
  let player: TestPlayer;
  let merchant3: Merchant3;

  beforeEach(() => {
    [game, player] = testGame(2);
    merchant3 = new Merchant3();
  });

  for (const run of [
    {
      name: 'claimable with 3 of every standard resource (plus the claim cost)',
      stock: {megacredits: 100, steel: 3, titanium: 3, plants: 3, energy: 3, heat: 3},
      expected: [1, true],
    },
    {
      name: '2 of each is not enough (the standard Merchant threshold)',
      stock: {megacredits: 100, steel: 2, titanium: 2, plants: 2, energy: 2, heat: 2},
      expected: [0, false],
    },
    {
      name: 'one resource short of 3 is not enough',
      stock: {megacredits: 100, steel: 3, titanium: 3, plants: 3, energy: 3, heat: 2},
      expected: [0, false],
    },
  ] as const) {
    it('canClaim ' + run.name, () => {
      player.stock.override(run.stock);
      expect(merchant3.getScore(player)).eq(run.expected[0]);
      expect(merchant3.canClaim(player)).eq(run.expected[1]);
    });
  }

  it('must keep 3 of each reserved after paying the claim cost', () => {
    // 3 of each reserved (including 3 M€), but nothing left to pay the claim cost.
    player.stock.override({megacredits: 3, steel: 3, titanium: 3, plants: 3, energy: 3, heat: 3});
    expect(merchant3.getScore(player)).eq(0);
    expect(merchant3.canClaim(player)).is.false;
  });

  it('claiming reserves 3 of each when paying with heat as M€', () => {
    game.milestones.length = 0;
    game.milestones.push(merchant3);
    player.canUseHeatAsMegaCredits = true;
    player.stock.override({megacredits: 3, heat: 11, steel: 3, titanium: 3, plants: 3, energy: 3});
    expect(merchant3.canClaim(player)).is.true;

    const claim = cast(player.getActions().options.find((o) => o.title === 'Claim a milestone'), OrOptions);
    cast(claim.options[0], SelectOption).cb(undefined);
    runAllActions(game);
    const selectPayment = cast(player.popWaitingFor(), SelectPayment);

    // 3 M€ + 5 heat covers the cost of 8 but spends the 3 M€ that must stay.
    expect(() => selectPayment.process({type: 'payment', payment: Payment.of({megacredits: 3, heat: 5})}, player)).to.throw();
    // The 3 heat reserve stays in place: 8 heat alone pays the cost.
    selectPayment.process({type: 'payment', payment: Payment.of({heat: 8})}, player);
    expect(player.heat).eq(3);
    expect(game.milestoneClaimed(merchant3)).is.true;
  });
});
