import {Units} from '../../common/Units';
import {ICard} from '../cards/ICard';
import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {BuildColony} from '../deferredActions/BuildColony';
import {DecreaseAnyProduction} from '../deferredActions/DecreaseAnyProduction';
import {Priority, SimpleDeferredAction} from '../deferredActions/DeferredAction';
import {PlaceCityTile} from '../deferredActions/PlaceCityTile';
import {PlaceGreeneryTile} from '../deferredActions/PlaceGreeneryTile';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';
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

    if (behavior.colonies?.buildColony !== undefined) {
      if (player.colonies.getPlayableColonies(behavior.colonies.buildColony.allowDuplicates).length === 0) {
        return false;
      }
    }

    if (behavior.city !== undefined) {
      if (behavior.city.space === undefined) {
        return player.game.board.getAvailableSpacesForCity(player).length > 0;
      }
    }

    if (behavior.greenery !== undefined) {
      return player.game.board.getAvailableSpacesForGreenery(player).length > 0;
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
    if (behavior.steelValue === 1) {
      player.increaseSteelValue();
    }
    if (behavior.titanumValue === 1) {
      player.increaseTitaniumValue();
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
    if (behavior.colonies !== undefined) {
      const colonies = behavior.colonies;
      if (colonies.buildColony !== undefined) {
        player.game.defer(new BuildColony(player, {allowDuplicate: colonies.buildColony.allowDuplicates}));
      }
      if (colonies.addTradeFleet !== undefined) {
        for (let idx = 0; idx < colonies.addTradeFleet; idx++) {
          player.colonies.increaseFleetSize();
        }
      }
      if (colonies.tradeDiscount !== undefined) {
        player.colonies.tradeDiscount += colonies.tradeDiscount;
      }
      if (colonies.tradeOffset !== undefined) {
        player.colonies.tradeOffset += colonies.tradeOffset;
      }
    }

    if (behavior.ocean !== undefined) {
      player.game.defer(new PlaceOceanTile(player));
    }
    if (behavior.city !== undefined) {
      if (behavior.city.space !== undefined) {
        player.game.addCityTile(player, behavior.city.space, behavior.city.type);
      } else {
        player.game.defer(new PlaceCityTile(player));
      }
    }
    if (behavior.greenery !== undefined) {
      player.game.defer(new PlaceGreeneryTile(player));
    }
  }

  public static onDiscard(player: Player, behavior: Behavior) {
    if (behavior.steelValue === 1) {
      player.decreaseSteelValue();
    }
    if (behavior.titanumValue === 1) {
      player.decreaseTitaniumValue();
    }

    if (behavior.colonies !== undefined) {
      const colonies = behavior.colonies;
      if (colonies.addTradeFleet !== undefined) {
        for (let idx = 0; idx < colonies.addTradeFleet; idx++) {
          player.colonies.decreaseFleetSize();
        }
      }
      if (colonies.tradeDiscount !== undefined) {
        player.colonies.tradeDiscount -= colonies.tradeDiscount;
      }
      if (colonies.tradeOffset !== undefined) {
        player.colonies.tradeOffset -= colonies.tradeOffset;
      }
    }
  }
}
