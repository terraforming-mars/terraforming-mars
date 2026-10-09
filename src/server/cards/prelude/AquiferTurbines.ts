import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {Priority} from '../../deferredActions/Priority';
import {CardRenderer} from '../render/CardRenderer';
import {Space} from '../../boards/Space';
import {TurmoilHandler} from '../../turmoil/TurmoilHandler';
import {REDS_RULING_POLICY_COST} from '../../../common/constants';
import {TileType} from '../../../common/TileType';
import {Units} from '../../../common/Units';

export class AquiferTurbines extends PreludeCard {
  constructor() {
    super({
      name: CardName.AQUIFER_TURBINES,
      tags: [Tag.POWER],

      behavior: {
        production: {energy: 2},
      },

      startingMegacredits: -3,

      metadata: {
        cardNumber: 'P02',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).production((pb) => pb.energy(2)).br;
          b.megacredits(-3);
        }),
        description: 'Place an ocean tile. Increase your energy production 2 steps. Pay 3 M€.',
      },
    });
  }

  /**
   * Ocean spaces where the M€ gained from placing the ocean covers what's left of the 3 M€ cost.
   */
  private availableSpaces(player: IPlayer): ReadonlyArray<Space> {
    const redsCost = TurmoilHandler.computeTerraformRatingBump(player, {oceans: 1}) * REDS_RULING_POLICY_COST;
    const spendable = player.spendableMegacredits();

    // Reds is paid before deferred gains (e.g. Polaris) arrive, so it must be affordable up front.
    // TODO(kberg): Try to fix that.
    if (spendable < redsCost) {
      return [];
    }

    const amountToPay = -this.startingMegaCredits + redsCost;
    const board = player.game.board;
    return board.getAvailableSpacesForOcean(player)
      .filter((space) => {
        const gained = board.megacreditsFromOceanPlacement(player, space) + this.megacreditsFromCards(player, space);
        return spendable + gained >= amountToPay;
      });
  }

  /** M€ `player`'s cards give them for placing an ocean on `space`. */
  private megacreditsFromCards(player: IPlayer, space: Space): number {
    const hasManutech = player.tableau.has(CardName.MANUTECH);
    let megacredits = 0;
    for (const card of player.tableau) {
      const gain = card.gainsFromTilePlacement?.(player, space, TileType.OCEAN);
      if (gain !== undefined) {
        megacredits += this.spendable(player, gain.stock);
        if (hasManutech) {
          megacredits += this.spendable(player, gain.production);
        }
      }
    }
    return megacredits;
  }

  /** The part of `units` that `player` can spend as M€. */
  private spendable(player: IPlayer, units: Units): number {
    return units.megacredits + (player.canUseHeatAsMegaCredits ? units.heat : 0);
  }

  public override bespokeCanPlay(player: IPlayer) {
    if (!player.game.canAddOcean()) {
      this.addWarning('maxoceans');
      return player.canAfford(-this.startingMegaCredits);
    }
    // availableSpaces covers the same canAfford check.
    return this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    const spaces = game.canAddOcean() ? this.availableSpaces(player) : [];
    game.defer(new PlaceOceanTile(player, {spaces: spaces})).andThen(() => {
      game.defer(new SelectPaymentDeferred(player, -this.startingMegaCredits), Priority.LOSE_RESOURCE_OR_PRODUCTION);
    });
    return undefined;
  }
}
