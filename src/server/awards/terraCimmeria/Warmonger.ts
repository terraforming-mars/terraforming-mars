import {ICard} from '../../cards/ICard';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {CardType} from '../../../common/cards/CardType';

export class Warmonger implements IAward {
  public readonly name = 'Warmonger';
  public readonly description = 'Play the most cards that reduce other players\' resources or production';

  public getScore(player: IPlayer): number {
    const score = player.tableau.filter((card) => {
      if (Warmonger.attackCards.includes(card.name)) return true;
      return Warmonger.autoInclude(card);
    }).length;

    return score;
  }

  public static autoInclude(card: ICard) {
    if (card.type === CardType.EVENT) {
      return;
    }
    if (card.behavior !== undefined) {
      const behavior = card.behavior;
      if (behavior.removeAnyPlants !== undefined) return true;
      if (behavior.decreaseAnyProduction !== undefined) return true;
    }
    return false;
  }

  // This is the list of cards that have bespoke attack code.
  // public for testing.
  public static attackCards: ReadonlyArray<CardName> = [
    // Base + Corp Era
    CardName.ANTS,
    CardName.ASTEROID_MINING_CONSORTIUM,
    CardName.ENERGY_TAPPING,
    CardName.GREAT_ESCARPMENT_CONSORTIUM,
    CardName.HACKERS,
    CardName.POWER_SUPPLY_CONSORTIUM,
    CardName.PREDATORS,
    // Venus
    // Colonies
    // Turmoil
    // Promo
    CardName.MONS_INSURANCE,
    // Moon
    CardName.ANCIENT_SHIPYARDS,
    CardName.THE_DARKSIDE_OF_THE_MOON_SYNDICATE,
    // Pathfinders
    // CEOs
    CardName.BJORN,
    // Star Wars
    CardName.CLONE_TROOPERS,
    // Underworld
    CardName.CLASS_ACTION_LAWSUIT,
    CardName.HACKERS_UNDERWORLD,
    CardName.INVESTIGATIVE_JOURNALISM,
    CardName.SPACE_PRIVATEERS,
  ] as const;
}
