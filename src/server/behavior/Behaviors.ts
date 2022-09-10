import {Units} from '../../common/Units';
import {ICard} from '../cards/ICard';
import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {DecreaseAnyProduction} from '../deferredActions/DecreaseAnyProduction';
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
      return player.canReduceAnyProduction(behavior.decreaseAnyProduction.type, behavior.decreaseAnyProduction.count);
    }

    return true;
  }

  public static execute(player: Player, _card: ICard, behavior: Behavior) {
    if (behavior.production !== undefined) {
      player.production.adjust(Units.of(behavior.production));
    }
    if (behavior.stock) {
      player.addUnits(behavior.stock);
    }
    if (behavior.drawCard !== undefined) {
      if (typeof(behavior.drawCard) === 'number') {
        player.drawCard(behavior.drawCard);
      } else {
        const options = behavior.drawCard;
        player.drawCard(options.count, {tag: options.tag, resource: options.resource, cardType: options.type});
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
    if (behavior.addResourcesToAnyCard) {
      const array = Array.isArray(behavior.addResourcesToAnyCard) ? behavior.addResourcesToAnyCard : [behavior.addResourcesToAnyCard];
      for (const entry of array) {
        player.game.defer(new AddResourcesToCard(player, entry.type, {count: entry.count}));
      }
    }
    if (behavior.decreaseAnyProduction !== undefined) {
      player.game.defer(new DecreaseAnyProduction(player, behavior.decreaseAnyProduction.type, {count: behavior.decreaseAnyProduction.count}));
    }
  }
}
