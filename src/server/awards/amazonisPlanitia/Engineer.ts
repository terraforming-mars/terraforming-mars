import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Engineer implements IAward {
  public readonly name = 'Engineer';
  public readonly description = 'Most cards that directly alter your own production';

  public getScore(player: Player): number {
    // TODO(kberg): should Engineer include events?
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
    CardName.SATELLITES,
    // Colonies
    CardName.COMMUNITY_SERVICES,
    CardName.ECOLOGY_RESEARCH,
    CardName.FLOATER_LEASING,
    CardName.LUNAR_EXPORTS,
    CardName.MINORITY_REFUGE,
    CardName.PIONEER_SETTLEMENT,
    CardName.QUANTUM_COMMUNICATIONS,
    // Promo
    CardName.INTERPLANETARY_TRADE,
    CardName.MONS_INSURANCE,
    // Moon
    CardName.DARKSIDE_MINING_SYNDICATE,
    CardName.ROVER_DRIVERS_UNION,
    CardName.LUNA_FIRST_INCORPORATED,
  ];
}
