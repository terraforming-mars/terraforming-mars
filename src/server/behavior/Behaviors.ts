import {Units} from '../../common/Units';
import {ICard} from '../cards/ICard';
import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {BuildColony} from '../deferredActions/BuildColony';
import {DecreaseAnyProduction} from '../deferredActions/DecreaseAnyProduction';
import {Priority, SimpleDeferredAction} from '../deferredActions/DeferredAction';
import {RemoveAnyPlants} from '../deferredActions/RemoveAnyPlants';
import {MoonExpansion} from '../moon/MoonExpansion';
import {Player} from '../Player';
import {Behavior} from './Behavior';

export class Behaviors {
  public static canExecute(player: Player, _card: ICard, behavior: Behavior) {
    if (behavior.production && !player.production.canAdjust(Units.of(behavior.production))) {
      return false;
    }
    if (behavior.stock !== undefined) {
      // Only supporting positive values for now.
      if (Units.keys.some((key) => (behavior.stock?.[key] ?? 0) < 0)) {
        throw new Error('Not supporting negative units for now.');
      }

      // if (!player.hasUnits(behavior.stock)) {
      //   return false;
      // }
    }
    if (behavior.decreaseAnyProduction !== undefined) {
      if (!player.canReduceAnyProduction(behavior.decreaseAnyProduction.type, behavior.decreaseAnyProduction.count)) {
        return false;
      }
    }

    if (behavior.colony !== undefined) {
      if (player.colonies.getPlayableColonies(behavior.colony.allowDuplicates).length === 0) {
        return false;
      }
    }
    return true;
  }

  public static execute(player: Player, card: ICard, behavior: Behavior) {
    if (behavior.production !== undefined) {
      player.production.adjust(Units.of(behavior.production));
    }
    if (behavior.stock) {
      player.addUnits(behavior.stock);
    }
    if (behavior.drawCard !== undefined) {
      const drawCard = behavior.drawCard;
      if (typeof(drawCard) === 'number') {
        player.drawCard(drawCard);
      } else {
        // This conditional could probably be removed, using the else clause for both.
        if (drawCard.keep === undefined && drawCard.pay === undefined) {
          player.drawCard(drawCard.count, {tag: drawCard.tag, resource: drawCard.resource, cardType: drawCard.type});
        } else {
          const input = player.drawCardKeepSome(drawCard.count, {
            tag: drawCard.tag,
            resource: drawCard.resource,
            cardType: drawCard.type,
            keepMax: drawCard.keep,
            paying: drawCard.pay,
          });
          // By moving behavior to this object, Priority for this action is changing from DEFAULT.
          // TODO: remove this comment block by 2023-10-01, or once bug reports on card drawing order subsides.
          player.defer(input, Priority.DRAW_CARDS);
        }
      }
    }

    if (behavior.global !== undefined) {
      const g = behavior.global;
      if (g.temperature !== undefined) player.game.increaseTemperature(player, g.temperature);
      if (g.oxygen !== undefined) player.game.increaseOxygenLevel(player, g.oxygen);
      if (g.venus !== undefined) player.game.increaseVenusScaleLevel(player, g.venus);
      if (g.moonColony !== undefined) MoonExpansion.raiseColonyRate(player, g.moonColony);
      if (g.moonMining !== undefined) MoonExpansion.raiseMiningRate(player, g.moonMining);
      if (g.moonLogistics !== undefined) MoonExpansion.raiseLogisticRate(player, g.moonLogistics);
    }

    if (behavior.tr !== undefined) {
      player.increaseTerraformRatingSteps(behavior.tr);
    }
    if (behavior.addResources !== undefined) {
      player.game.defer(new SimpleDeferredAction(player, () => {
        player.addResourceTo(card, behavior.addResources);
        return undefined;
      }));
    }

    if (behavior.addResourcesToAnyCard) {
      const array = Array.isArray(behavior.addResourcesToAnyCard) ? behavior.addResourcesToAnyCard : [behavior.addResourcesToAnyCard];
      for (const entry of array) {
        player.game.defer(new AddResourcesToCard(player, entry.type, {count: entry.count}));
      }
    }
    if (behavior.decreaseAnyProduction !== undefined) {
      player.game.defer(new DecreaseAnyProduction(player, behavior.decreaseAnyProduction.type, {count: behavior.decreaseAnyProduction.count}));
    }
    if (behavior.removeAnyPlants !== undefined) {
      player.game.defer(new RemoveAnyPlants(player, behavior.removeAnyPlants));
    }
    if (behavior.colony !== undefined) {
      player.game.defer(new BuildColony(player, {allowDuplicate: behavior.colony.allowDuplicates}));
    }
    if (behavior.addTradeFleet !== undefined) {
      for (let idx = 0; idx < behavior.addTradeFleet; idx++) {
        player.colonies.increaseFleetSize();
      }
    }
    if (behavior.tradeDiscount !== undefined) {
      player.colonies.tradeDiscount += behavior.tradeDiscount;
    }
    if (behavior.tradeOffset !== undefined) {
      player.colonies.tradeOffset += behavior.tradeOffset;
    }
  }

  public static discard(player: Player, _card: ICard, behavior: Behavior) {
    if (behavior.addTradeFleet !== undefined) {
      for (let idx = 0; idx < behavior.addTradeFleet; idx++) {
        player.colonies.decreaseFleetSize();
      }
    }
    if (behavior.tradeDiscount !== undefined) {
      player.colonies.tradeDiscount -= behavior.tradeDiscount;
    }
    if (behavior.tradeOffset !== undefined) {
      player.colonies.tradeOffset -= behavior.tradeOffset;
    }
  }
}
