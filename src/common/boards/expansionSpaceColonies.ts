import {SpaceName} from './SpaceName';
import {CardName} from '../cards/CardName';

export const expansionSpaceColonies = [
  {name: SpaceName.STANFORD_TORUS, expansion: 'promo', card: CardName.STANFORD_TORUS},
  {name: SpaceName.DAWN_CITY, expansion: 'venus', card: CardName.DAWN_CITY},
  {name: SpaceName.LUNA_METROPOLIS, expansion: 'venus', card: CardName.LUNA_METROPOLIS},
  {name: SpaceName.MAXWELL_BASE, expansion: 'venus', card: CardName.MAXWELL_BASE},
  {name: SpaceName.STRATOPOLIS, expansion: 'venus', card: CardName.STRATOPOLIS},
  {name: SpaceName.CERES_SPACEPORT, expansion: 'pathfinders', card: CardName.CERES_SPACEPORT},
  {name: SpaceName.DYSON_SCREENS, expansion: 'pathfinders', card: CardName.DYSON_SCREENS},
  {name: SpaceName.LUNAR_EMBASSY, expansion: 'pathfinders', card: CardName.LUNAR_EMBASSY},
  {name: SpaceName.VENERA_BASE, expansion: 'pathfinders', card: CardName.VENERA_BASE},
] as const;
