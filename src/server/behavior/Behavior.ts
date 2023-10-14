// import {SpaceType} from '../../common/boards/SpaceType';
import {CardResource} from '../../common/CardResource';
import {CardType} from '../../common/cards/CardType';
import {Resource} from '../../common/Resource';
import {Tag} from '../../common/cards/Tag';
// import {SpaceId} from '../../common/Types';
// import {CardResource} from '../../common/CardResource';
// import {TileType} from '../../common/TileType';
import {SpaceId} from '../../common/Types';
import {MoonSpaces} from '../../common/moon/MoonSpaces';
import {TileType} from '../../common/TileType';
import {Countable, CountableUnits} from './Countable';
import {PlacementType} from '../boards/PlacementType';
import {AdjacencyBonus} from '../ares/AdjacencyBonus';
import {Units} from '../../common/Units';

type ValueOf<Obj> = Obj[keyof Obj];
type OneOnly<Obj, Key extends keyof Obj> = { [key in Exclude<keyof Obj, Key>]: null } & Pick<Obj, Key>;
type OneOfByKey<Obj> = { [key in keyof Obj]: OneOnly<Obj, key> };
export type OneOfType<Obj> = ValueOf<OneOfByKey<Obj>>;


export interface Spend extends Units {
  /** units or a number of resources from the card. */
  resourcesHere: number,
}

/** A set of steps that an action can perform in any specific order. */
export interface Behavior {
  /** Select one of these actions */
  or?: OrBehavior;

  /**
   * Spend one of resources before taking the action.
   *
   * This is specifically designed to spend only one resource type.
   */
  spend?: Partial<OneOfType<Spend>>;

  /** Gain or lose production */
  production?: Partial<CountableUnits>;
  /** Gain or lose stock */
  stock?: Partial<CountableUnits>;

  /** Gain n standard resources */
  standardResource?: number;

  /** Add resources to this card itself */
  addResources?: Countable;

  /** Add resources to any cards */
  addResourcesToAnyCard?: AddResource | Array<Omit<AddResource, 'mustHaveCard'>>;

  // /** Remove resources from any card */
  // removeResourcesFromAnyCard?: Omit<AddResource, 'mustHaveCard'>; // This Omit thing isn't right.

  /** Decrease any production */
  decreaseAnyProduction?: DecreaseAnyProduction;
  removeAnyPlants?: number,

  /** Gain units of TR */
  // TODO(kberg) permit losing TR for TerralabsResearch
  tr?: number;

  /** Raise certain global parameters. */
  global?: {
    temperature?: -2 | -1 | 1 | 2 | 3;
    oxygen?: 2 | 1 | -1 | -2;
    venus?: 3 | 2 | 1 | -1;
  },

  city?: {
    space?: SpaceId,
    on?: PlacementType,
  },
  /** Places a greenery tile and also raises the oxygen. */
  greenery?: {
    on?: PlacementType,
  },
  ocean?: {
    count?: 2,
    on?: PlacementType,
  },

  tile?: {
    type: TileType,
    on: PlacementType,
    adjacencyBonus?: AdjacencyBonus,
    title?: string,
  },

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

  turmoil?: {
    influenceBonus?: 1,
    sendDelegates?: {
      count: number,
      manyParties?: boolean,
    },
  },

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

  underworld?: {
    // identify?: Countable,
    // excavate?: number | {count: Countable, ignorePlacementRestrictions?: boolean},
    corruption?: Countable,
    // markThisGeneration?: NoAttributes,
  },
}

export interface PlaceMoonTile {
  space?: MoonSpaces;
}

export interface DrawCard {
  count: Countable,
  /** The number of cards to keep, should be between [1..count-1] */
  keep?: number,
  /** When true, player may keep the card if they choose to pay for it. (e.g. 3MC.) */
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
  tag?: Tag,
  /**
   * If true, then there must be a card that matches this requirement to take the action.
   *
   * While the game allows players to take an action that places a resource even though
   * there might not be a card to accept it, that can often make for players wasting
   * resources without realizing it. In other words, a true value is a break from the standard rules.
   */
  mustHaveCard?: boolean,

  /** When > 0, only cards with at least `min` resources count. */
  min?: number,

  /** When true, include self-replicating robots cards. */
  robotCards?: true,

  /** If true, if only one card matches, apply immediately without asking. */
  // WARNING: I don't think this is actually used.
  autoSelect?: boolean,
}

export interface DecreaseAnyProduction {
  count: number;
  type: Resource;
}

export interface TitledBehavior extends Behavior {
  title: string;
}

export interface OrBehavior {
  behaviors: Array<TitledBehavior>;
  autoSelect?: boolean;
}
