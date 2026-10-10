import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Merchant3} from '@/server/milestones/Merchant3';
import {TestPlayer} from '@tests/TestPlayer';

describe('Merchant3', () => {
  let player: TestPlayer;
  let merchant3: Merchant3;

  beforeEach(() => {
    [/* game */, player] = testGame(1);
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
});
