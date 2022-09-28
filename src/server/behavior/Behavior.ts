// import {SpaceType} from '../../common/boards/SpaceType';
import {CardResource} from '../../common/CardResource';
import {CardType} from '../../common/cards/CardType';
import {Resources} from '../../common/Resources';
import {Tag} from '../../common/cards/Tag';
// import {SpaceId} from '../../common/Types';
// import {CardResource} from '../../common/CardResource';
// import {TileType} from '../../common/TileType';
import {SpaceId} from '../../common/Types';
import {SpaceType} from '../../common/boards/SpaceType';
import {MoonSpaces} from '../../common/moon/MoonSpaces';
import {TileType} from '../../common/TileType';
import {NoAttributes} from './NoAttributes';
import {Countable, CountableUnits} from './Countable';

/** A set of steps that an action can perform in any specific order. */

export interface Behavior {
  /** Gain or lose production */
  production?: Partial<CountableUnits>;
  /** Gain or lose stock */
  stock?: Partial<CountableUnits>;

  /** Add resources to this card itself */
  addResources?: Countable;

  /** Add resources to any cards */
  addResourcesToAnyCard?: AddResource | Array<AddResource>;

  /** Decrease any production */
  decreaseAnyProduction?: DecreaseAnyProduction;
  removeAnyPlants?: number,

  /** Gain units of TR */
  tr?: number;

  /** Raise certain global parameters. */
  global?: {
    temperature?: -2 | -1 | 1 | 2 | 3;
    oxygen?: 2 | 1 | -1 | -2;
    venus?: 3 | 2 | 1 | -1;
  },

  city?: {space?: SpaceId, type?: SpaceType},
  /** Places a greenery tile and also raises the oxygen. */
  greenery?: NoAttributes,
  ocean?: NoAttributes,

  /** Remove plants from any player. Typical for asteroid cards. */
  // removePlants: number,

  /** Remove resources from any player.
  // removeAnyResource: {type: CardResource, count: number},

  /** Raise the titanium and steel value. On discard, reduce them. */
  titanumValue?: 1;
  steelValue?: 1;

  /** Draw this many cards from the deck. */
  drawCard?: number | DrawCard,

  /** Greeneries cost one plant less. */
  greeneryDiscount?: 1,

  // spendResourcesHere: number,
  // spendResource: {type: CardResource, count: number},
  // tile: {type: TileType, space?: SpaceId, spaceType?: SpaceType};
  colonies?: {
    buildColony?: {
      allowDuplicates?: boolean,
    },

    /** Add this many trade fleets to your armada. */
    addTradeFleet?: number,

    /** When trading increase the colony track this many steps. */
    tradeDiscount?: number,

    /** When trading increase the colony track this many steps. */
    tradeOffset?: number,
  }

  moon?: {
    /** Places a habitat tile and also raises the habitat rate */
    habitatTile?: PlaceMoonTile,
    /** Places a mine tile and also raises the mining rate */
    mineTile?: PlaceMoonTile,
    /** Places a road tile and also raises the logistics rate */
    roadTile?: PlaceMoonTile,
    /** Places a special tile on the Moon. */
    tile?: PlaceMoonTile & {type: TileType, title?: string},
    habitatRate?: number,
    miningRate?: number,
    logisticsRate?: number,
  },
}

export interface PlaceMoonTile {
  space?: MoonSpaces;
}

export interface DrawCard {
  count: Countable,
  /** The number of cards to keep, should be between [1..count-1] */
  keep?: number,
  /** When true, player has to pay to keep the card. (e.g. 3MC) */
  pay?: boolean,

  /** Discard cards without this tag */
  tag?: Tag,
  /** Discard cards not of this type */
  type?: CardType,
  /** Discard cards without this type of resource. */
  resource?: CardResource,
}

export interface AddResource {
  count: Countable,
  type?: CardResource,
  tag?: Tag;
}

export interface DecreaseAnyProduction {
  count: number;
  type: Resources;
}
