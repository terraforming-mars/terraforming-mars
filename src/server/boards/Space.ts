import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceType} from '../../common/boards/SpaceType';
import {Tile} from '../Tile';
import {AdjacencyBonus} from '../ares/AdjacencyBonus';
import {SpaceId} from '../../common/Types';
import {IPlayer} from '../IPlayer';

export type Space = {
    id: SpaceId;
    spaceType: SpaceType;
    tile?: Tile;
    player?: IPlayer;
    bonus: Array<SpaceBonus>;
    adjacency?: AdjacencyBonus,
    x: number;
    y: number;
}

export function newSpace(
  id: SpaceId,
  spaceType: SpaceType,
  x: number,
  y: number,
  bonus: Array<SpaceBonus>): Space {
  return {id, spaceType, x, y, bonus};
}
