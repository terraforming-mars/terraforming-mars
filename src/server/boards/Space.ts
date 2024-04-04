import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceType} from '../../common/boards/SpaceType';
import {Tile} from '../Tile';
import {AdjacencyBonus} from '../ares/AdjacencyBonus';
import {SpaceId} from '../../common/Types';
import {IPlayer} from '../IPlayer';
import {UndergroundResourceToken} from '../../common/underworld/UndergroundResourceToken';

export type Space = {
  /** The unique ID of this space*/
  readonly id: SpaceId;
  /** The x-coordinate of this space, or -1 if it is not the main board (e.g. colony) */
  readonly x: number;
  /** The y-coordinate of this space, or -1 if it is not the main board (e.g. colony) */
  readonly y: number;

  /** The type of space: ocean, space colony, etc. */
  spaceType: SpaceType;
  /** The tile placed on top of the space. Could be a hazard tile. */
  tile?: Tile;
  /** The player who owns this tile. Will show a token, even the neutral player */
  player?: IPlayer;
  /** The bonuses granted to a player for placing a tile on this space. */
  bonus: Array<SpaceBonus>;
  /** The bonuses granted to players when placing tiles NEXT TO this space. */
  adjacency?: AdjacencyBonus,

  /** Optional underworld expansion resource token. */
  undergroundResources?: UndergroundResourceToken;
  /** Optional underworld player who excavated this resource token. */
  excavator?: IPlayer;

  /** This tile's co-owner. Used for The Moon's Hostile Takeover card. */
  coOwner?: IPlayer;
}

export function newSpace(
  id: SpaceId,
  spaceType: SpaceType,
  x: number,
  y: number,
  bonus: Array<SpaceBonus>): Space {
  return {id, spaceType, x, y, bonus};
}
