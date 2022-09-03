import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Warmonger implements IAward {
  public readonly name = 'Warmonger';
  public readonly description = 'Most cards that reduce other players\' resources or production';

  public getScore(player: Player): number {
    const cardNames = player.playedCards.map((card) => card.name);
    return cardNames.filter((name) => Warmonger.attackCards.includes(name)).length;
  }

  private static attackCards = [
    // Base + Corp Era
    CardName.ANTS,
    CardName.ASTEROID,
    CardName.ASTEROID_MINING_CONSORTIUM,
    CardName.BIG_ASTEROID,
    CardName.BIOMASS_COMBUSTORS,
    CardName.BIRDS,
    CardName.CLOUD_SEEDING,
    CardName.COMET,
    CardName.DEIMOS_DOWN,
    CardName.ENERGY_TAPPING,
    CardName.FISH,
    CardName.FLOODING,
    CardName.GIANT_ICE_ASTEROID,
    CardName.GREAT_ESCARPMENT_CONSORTIUM,
    CardName.HACKERS,
    CardName.HEAT_TRAPPERS,
    CardName.HERBIVORES,
    CardName.HIRED_RAIDERS,
    CardName.POWER_SUPPLY_CONSORTIUM,
    CardName.PREDATORS,
    CardName.SABOTAGE,
    CardName.SMALL_ANIMALS,
    CardName.VIRUS,
    // Venus
    CardName.COMET_FOR_VENUS,
    // Colonies
    CardName.AIR_RAID,
    CardName.IMPACTOR_SWARM,
    CardName.SUBZERO_SALT_FISH,
    // Turmoil
    CardName.AERIAL_LENSES,
    CardName.LAW_SUIT,
    // Promo
    CardName.SMALL_ASTEROID,
    CardName.DEIMOS_DOWN_PROMO,
    CardName.MONS_INSURANCE,
    // Ares
    CardName.METALLIC_ASTEROID,
    // Moon
    CardName.ANCIENT_SHIPYARDS,
    CardName.COSMIC_RADIATION,
    CardName.THE_DARKSIDE_OF_THE_MOON_SYNDICATE,
    // Pathfinders
    CardName.DUST_STORM,
    CardName.SOLAR_STORM,
  ];
}
