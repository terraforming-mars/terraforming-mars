import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Merchant} from '../../../src/server/milestones/modular/Merchant';
import {TestPlayer} from '../../TestPlayer';
import {StormCraftIncorporated} from '../../../src/server/cards/colonies/StormCraftIncorporated';
import {VanAllen} from '../../../src/server/cards/ceos/VanAllen';
import {SelectPayment} from '../../../src/server/inputs/SelectPayment';
import {Payment} from '../../../src/common/inputs/Payment';
import {Units} from '../../../src/common/Units';
import {ALL_RESOURCES} from '../../../src/common/Resource';
import {NirgalEnterprises} from '../../../src/server/cards/prelude2/NirgalEnterprises';
import {StagedProtests} from '../../../src/server/cards/underworld/StagedProtests';

describe('Merchant', () => {
  let milestone: Merchant;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Merchant();
    [/* game */, player] = testGame(2);
  });

  it('getScore is 1 when claimable', () => {
    player.stock.override({...Units.every(2), megacredits: 10});
    expect(milestone.getScore(player)).eq(1);
  });

  it('getScore is 0 when not claimable', () => {
    player.stock.override({...Units.every(2), megacredits: 9});
    expect(milestone.getScore(player)).eq(0);
  });

  for (const type of ALL_RESOURCES) {
    it('Cannot claim when ' + type + ' is missing one resource type', () => {
      player.stock.override({...Units.every(2), megacredits: 10});
      player.stock.add(type, -1);
      expect(milestone.canClaim(player)).is.false;
    });
  }

  for (const run of [
    {heat: 10, canUseHeat: true, expected: true},
    {heat: 9, canUseHeat: true, expected: false},
    {heat: 10, canUseHeat: false, expected: false},
  ] as const) {
    it('Helion ' + JSON.stringify(run), () => {
      player.canUseHeatAsMegaCredits = run.canUseHeat;
      player.stock.override({megacredits: 2, steel: 2, titanium: 2, plants: 2, energy: 2, heat: run.heat});

      expect(milestone.canClaim(player)).eq(run.expected);
    });
  }

  for (const run of [
    {floaters: 5, expected: true},   // 5 × 2 = 10 availableHeat; 2 reserved, 8 usable as MC
    {floaters: 4, expected: false},  // 4 × 2 = 8 availableHeat; 2 reserved, only 6 usable as MC
  ] as const) {
    it('StormCraft Incorporated ' + JSON.stringify(run), () => {
      player.canUseHeatAsMegaCredits = true;
      const stormcraft = new StormCraftIncorporated();
      stormcraft.resourceCount = run.floaters;
      player.playedCards.push(stormcraft);
      player.stock.override({megacredits: 2, steel: 2, titanium: 2, plants: 2, energy: 2});

      expect(milestone.canClaim(player)).eq(run.expected);
    });
  }

  for (const run of [
    {titanium: 6, canUseTitanium: true, expected: true},   // 2 reserved, 4 × 2MC = 8 covers cost
    {titanium: 5, canUseTitanium: true, expected: false},
    {titanium: 6, canUseTitanium: false, expected: false},
  ] as const) {
    it('Luna Trade Federation ' + JSON.stringify(run), () => {
      player.canUseTitaniumAsMegacredits = run.canUseTitanium;
      player.stock.override({megacredits: 2, heat: 2, steel: 2, plants: 2, energy: 2, titanium: run.titanium});

      expect(milestone.canClaim(player)).eq(run.expected);
    });
  }

  it('Compatible with Van Allen', () => {
    player.stock.override(Units.every(2));
    expect(milestone.canClaim(player)).is.false;

    player.playedCards.push(new VanAllen());
    expect(milestone.canClaim(player)).is.true;
  });

  it('Compatible with Nirgal Enterprises', () => {
    player.stock.override(Units.every(2));
    expect(milestone.canClaim(player)).is.false;

    player.playedCards.push(new NirgalEnterprises());
    expect(milestone.canClaim(player)).is.true;
  });

  it('Compatible with Staged Protests', () => {
    player.stock.override({...Units.every(2), megacredits: 17});
    expect(milestone.canClaim(player)).is.true;

    const stagedProtests = new StagedProtests();
    player.playedCards.push(stagedProtests);
    stagedProtests.generationUsed = player.game.generation;
    expect(milestone.canClaim(player)).is.false;
    player.megaCredits++;
    expect(milestone.canClaim(player)).is.true;
  });

  describe('Payment reserve enforcement', () => {
    // SelectPayment.process() validates canSpend and payingAmount >= cost, but does not
    // validate that reserveUnits are preserved after payment. The reserveUnits field is
    // only forwarded to the client for UI guidance. A Helion player with 2 MC + 10 heat
    // can submit {megaCredits: 2, heat: 6} — a valid 8 MC payment — and end up with
    // 0 MC, violating the 2 MC reserve. These tests document the requirement that
    // reserve units must be server-side enforced.

    it('Helion: payment using reserved megacredits should be rejected', () => {
      player.canUseHeatAsMegaCredits = true;
      player.stock.override({megacredits: 2, heat: 10, steel: 2, titanium: 2, plants: 2, energy: 2});
      expect(milestone.canClaim(player)).is.true;

      const selectPayment = new SelectPayment('Pay', 8, {heat: true}, Units.every(2));
      // Paying 2 MC + 6 heat = 8, but spends the reserved 2 MC (leaving 0 MC after)
      expect(() => selectPayment.process({type: 'payment', payment: Payment.of({megacredits: 2, heat: 6})}, player))
        .to.throw();
    });

    it('Luna Trade Federation: payment using reserved megacredits should be rejected', () => {
      player.canUseTitaniumAsMegacredits = true;
      player.stock.override({megacredits: 2, heat: 2, steel: 2, titanium: 6, plants: 2, energy: 2});
      expect(milestone.canClaim(player)).is.true;

      const selectPayment = new SelectPayment('Pay', 8, {}, Units.every(2));
      // Paying 2 MC + 3 titanium (×2) = 8, but spends the reserved 2 MC (leaving 0 MC after)
      expect(() => selectPayment.process({type: 'payment', payment: Payment.of({megacredits: 2, titanium: 3})}, player))
        .to.throw();
    });
  });
});
