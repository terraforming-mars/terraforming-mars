import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';

export class Engineer implements IAward {
  public readonly name = 'Engineer';
  public readonly description = 'Have the most cards in play that directly alter your own production';

  public getScore(player: IPlayer): number {
    const score = player.tableau.filter((card) => {
      if (Engineer.productionCards.includes(card.name)) return true;

      if (card.produce !== undefined) return true;
      const production = card.behavior?.production;
      if (production !== undefined) {
        // TODO(kberg): this is mildly unsafe because it doesn't take into account when
        // production[key] = undefined (e.g. {megacredits: undefined}).
        return Object.keys(production).length > 0;
      }
      return false;
    }).length;

    return score;
  }

  // This is the list of cards that have bespoke code to change production.
  // public for testing.
  public static productionCards = [
    // Base + Corp Era
    CardName.ARTIFICIAL_PHOTOSYNTHESIS,
    CardName.ASTEROID_MINING_CONSORTIUM,
    CardName.ENERGY_TAPPING,
    CardName.GREAT_ESCARPMENT_CONSORTIUM,
    CardName.INSULATION,
    CardName.NITROGEN_RICH_ASTEROID,
    CardName.POWER_SUPPLY_CONSORTIUM,
    // Colonies
    CardName.COMMUNITY_SERVICES,
    CardName.ECOLOGY_RESEARCH,
    CardName.LUNAR_EXPORTS,
    CardName.MINORITY_REFUGE,
    CardName.PIONEER_SETTLEMENT,
    CardName.QUANTUM_COMMUNICATIONS,
    // Promo
    CardName.INTERPLANETARY_TRADE,
    // Moon
    CardName.DARKSIDE_MINING_SYNDICATE,
    CardName.ROVER_DRIVERS_UNION,
    CardName.LUNA_FIRST_INCORPORATED,
    // Pathfinders
    CardName.RARE_EARTH_ELEMENTS,
    CardName.MICROBIOLOGY_PATENTS,
    CardName.OUMUAMUA_TYPE_OBJECT_SURVEY,
    CardName.RARE_EARTH_ELEMENTS,
    CardName.SMALL_OPEN_PIT_MINE,
  ];
}
