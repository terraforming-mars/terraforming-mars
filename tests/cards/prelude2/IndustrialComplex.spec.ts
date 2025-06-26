import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {IndustrialComplex} from '../../../src/server/cards/prelude2/IndustrialComplex';
import {cast, runAllActions, testGame} from '../../TestingUtils';
import {CardName} from '../../../src/common/cards/CardName';
import {newCorporationCard} from '../../../src/server/createCard';
import {Units} from '../../../src/common/Units';
import {SelectPayment} from '../../../src/server/inputs/SelectPayment';
import {Payment} from '../../../src/common/inputs/Payment';

const ONE_EACH = Units.of({megacredits: 1, steel: 1, titanium: 1, plants: 1, energy: 1, heat: 1});

describe('IndustrialComplex', () => {
  let card: IndustrialComplex;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new IndustrialComplex();
    [game, player] = testGame(2);
  });

  const runs = [
    {
      stock: {megacredits: 17}, production: {}, corps: [],
      canPlay: false,
    },
    {
      stock: {megacredits: 18}, production: {}, corps: [],
      canPlay: true,
      payment: undefined,
      expected: {production: {}, stock: {}},
    },
    {
      stock: {megacredits: 18}, production: {steel: 1}, corps: [],
      canPlay: true,
      payment: undefined,
      expected: {production: {}, stock: {}},
    },
    {
      stock: {megacredits: 17}, production: {}, corps: [CardName.MANUTECH],
      canPlay: true,
      payment: undefined,
      expected: {production: {}, stock: {...ONE_EACH, megacredits: 0}},
    },
    {
      stock: {megacredits: 17}, production: {megacredits: 1}, corps: [CardName.MANUTECH],
      canPlay: false,
    },
    {
      stock: {megacredits: 17, heat: 1}, production: {}, corps: [CardName.HELION],
      canPlay: true,
      payment: {megacredits: 17, heat: 1},
      expected: {production: {}, stock: {}},
    },
    {
      stock: {megacredits: 17, titanium: 1}, production: {}, corps: [CardName.LUNA_TRADE_FEDERATION],
      canPlay: true,
      payment: {megacredits: 16, titanium: 1},
      expected: {production: {}, stock: {megacredits: 1}},
    },
    {
      stock: {megacredits: 18}, production: {megacredits: -5}, corps: [],
      canPlay: true,
      payment: undefined,
      expected: {production: {}, stock: {}},
    },
  ] as const;

  for (const run of runs) {
    it('canPlay ' + JSON.stringify(run), () => {
      for (const corp of run.corps) {
        if (corp === CardName.HELION) {
          player.canUseHeatAsMegaCredits = true;
        }
        if (corp === CardName.LUNA_TRADE_FEDERATION) {
          player.canUseTitaniumAsMegacredits = true;
        }
        if (corp === CardName.MANUTECH) {
          player.corporations.push(newCorporationCard(corp)!);
        }
      }
      player.stock.override(run.stock);
      player.production.override(run.production);
      expect(card.canPlay(player)).eq(run.canPlay);
    });

    if (run.canPlay === true) { // Skipping the ones that fizzle.
      it('play ' + JSON.stringify(run), () => {
        for (const corp of run.corps) {
          if (corp === CardName.HELION) {
            player.canUseHeatAsMegaCredits = true;
          }
          if (corp === CardName.LUNA_TRADE_FEDERATION) {
            player.canUseTitaniumAsMegacredits = true;
          }
          if (corp === CardName.MANUTECH) {
            player.corporations.push(newCorporationCard(corp)!);
          }
        }
        player.stock.override(run.stock);
        player.production.override(run.production);
        cast(card.play(player), undefined);
        runAllActions(game);
        if (run.payment) {
          const selectPayment = cast(player.popWaitingFor(), SelectPayment);

          // Payment MC needs to be specified as "megaCredits"
          const adjusted = {...run.payment} as Partial<Payment>;
          adjusted.megaCredits = run.payment.megacredits;

          selectPayment.cb(Payment.of(adjusted));
          runAllActions(game);
        }

        // If not specified, the stock is zero.
        expect(player.stock.asUnits(), 'stock does not match').deep.eq(Units.of(run.expected.stock));
        // If not specified, the production is one.
        expect(player.production.asUnits(), 'production does not match').deep.eq({...ONE_EACH, ...run.expected.production});
      });
    }
  }
});
