// import {SpaceType} from '../../common/boards/SpaceType';
import {CardResource} from '@/common/CardResource';
import {CardType} from '@/common/cards/CardType';
import {Tag} from '../../common/cards/Tag';
// import {SpaceId} from '../../common/Types';
// import {CardResource} from '../../common/CardResource';
// import {TileType} from '../../common/TileType';
import {Units} from '../../common/Units';

/** A set of steps that an action can perform in any specific order. */

export interface Behavior {
  // Gain or lose production
  production?: Partial<Units>;
  // Gain or lose stock
  stock?: Partial<Units>;

  // // Add resources to this card itself
  // addResourceToSelf: number;

  // Add resources to any cards
  addResourcesToAnyCard?: AddResource | Array<AddResource>;

  // Gain units of TR
  tr?: number;

  // Raise certain global parameters.
  // Not sure how to deal with Oceans, yet.
  global?: {
    temperature?: -2 | -1 | 1 | 2 | 3;
    oxygen?: 2 | 1 | -1 | -2;
  //   ocean?: number;
    venus?: 3 | 2 | 1 | -1;
    moonColony?: number,
    moonMining?: number,
    moonLogistics?: number,
  },

  // // Remove plants from any player. Typical for asteroid cards.
  // removePlants: number,

  // // Remove resources from any player.
  // removeAnyResource: {type: CardResource, count: number},

  // // Raise the titanium and steel value. On discard, reduce them.
  // resourceValues: {titanum?: number, steel?: number},

  // Draw this many cards from the deck.
  drawCard?: number | DrawCard,

  // spendResourcesHere: number,
  // spendResource: {type: CardResource, count: number},
  // tile: {type: TileType, space?: SpaceId, spaceType?: SpaceType};
}

export interface DrawCard {
  count: number,
  tag?: Tag,
  type?: CardType,
  resource?: CardResource,
}
export interface AddResource {
  count: number,
  type?: CardResource,
  tag?: Tag;
}
