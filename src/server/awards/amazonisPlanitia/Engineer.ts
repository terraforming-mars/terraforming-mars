import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {ICard} from '../../cards/ICard';

/**
 * The list of cards that have bespoke code to change production.
 *
 * Public for testing.
 */
export const BESPOKE_PRODUCTION_CARDS: ReadonlyArray<CardName> = [
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
] as const;

// Mapping from [CardName => boolean] indicating whether a card is eligible for Engineer.
// This map serves as a lazy cache, evaluated as new cards come in.
const map = new Map<CardName, boolean>(BESPOKE_PRODUCTION_CARDS.map((name) => [name, true]));

export class Engineer implements IAward {
  public readonly name = 'Engineer';
  public readonly description = 'Have the most cards in play that directly alter your own production';

  public getScore(player: IPlayer): number {
    return player.tableau.filter((card) => {
      const eligible = map.get(card.name);
      if (eligible !== undefined) {
        return eligible;
      }
      const val = Engineer.autoInclude(card);
      map.set(card.name, val);
      return val;
    }).length;
  }

  /**
   * Returns true if `card`'s definition shows that it increases production, and is eligible for
   * this award.
   */
  public static autoInclude(card: ICard) {
    if (card.produce !== undefined) return true;
    const production = card.behavior?.production;
    if (production !== undefined) {
      return Object.keys(production).length > 0;
    }
    return false;
  }
}
