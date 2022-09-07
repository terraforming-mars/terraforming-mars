import {Units} from '../../common/Units';
import {ICard} from '../cards/ICard';
import {MoonExpansion} from '../moon/MoonExpansion';
import {Player} from '../Player';
import {InternalBehavior} from './Behavior';

export class Behaviors {
  public static canExecute(player: Player, _card: ICard, behavior: InternalBehavior) {
    if (behavior.production && !player.production.canAdjust(Units.of(behavior.production))) {
      return false;
    }
    if (behavior.stock !== undefined) {
      const stock = behavior.stock;
      // Only supporting positive values for now.
      if (Units.keys.some((key) => stock[key] < 0)) {
        throw new Error('Not supporting negative units for now.');
      }

      // if (!player.hasUnits(behavior.stock)) {
      //   return false;
      // }
    }
    return true;
  }

  public static execute(player: Player, _card: ICard, behavior: InternalBehavior) {
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
      const global = behavior.global;
      if (global.temperature !== undefined) player.game.increaseTemperature(player, global.temperature);
      if (global.oxygen !== undefined) player.game.increaseOxygenLevel(player, global.oxygen);
      if (global.venus !== undefined) player.game.increaseVenusScaleLevel(player, global.venus);
      if (global.moonColony !== undefined) MoonExpansion.raiseColonyRate(player, global.moonColony);
      if (global.moonMining !== undefined) MoonExpansion.raiseMiningRate(player, global.moonMining);
      if (global.moonLogistics !== undefined) MoonExpansion.raiseLogisticRate(player, global.moonLogistics);
    }
  }
}
