import {ICard} from '../../cards/ICard';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';

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
    CardName.FLOODING,
    CardName.GREAT_ESCARPMENT_CONSORTIUM,
    CardName.HACKERS,
    CardName.HIRED_RAIDERS,
    CardName.POWER_SUPPLY_CONSORTIUM,
    CardName.PREDATORS,
    CardName.SABOTAGE,
    // Venus
    CardName.COMET_FOR_VENUS,
    // Colonies
    CardName.AIR_RAID,
    // Turmoil
    CardName.LAW_SUIT,
    // Promo
    CardName.MONS_INSURANCE,
    // Moon
    CardName.ANCIENT_SHIPYARDS,
    CardName.COSMIC_RADIATION,
    CardName.THE_DARKSIDE_OF_THE_MOON_SYNDICATE,
    CardName.REVOLTING_COLONISTS,
    // Pathfinders
    CardName.DUST_STORM,
    CardName.SOLAR_STORM,
    CardName.PUBLIC_SPONSORED_GRANT,
    // CEOs
    CardName.BJORN,
    // Star Wars
    CardName.CLONE_TROOPERS,
    // Underworld
    CardName.ANTI_TRUST_CRACKDOWN,
    CardName.CLASS_ACTION_LAWSUIT,
    CardName.CORPORATE_BLACKMAIL,
    CardName.HACKERS_UNDERWORLD,
    CardName.HIRED_RAIDERS_UNDERWORLD,
    CardName.INVESTIGATIVE_JOURNALISM,
    CardName.MONOPOLY,
    CardName.PLANT_TAX,
    CardName.RECKLESS_DETONATION,
    CardName.SERVER_SABOTAGE,
    CardName.SPACE_PRIVATEERS,
    CardName.SUBNAUTIC_PIRATES,
  ] as const;
}
