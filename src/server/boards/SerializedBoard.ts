import {AdjacencyBonus} from '../ares/AdjacencyBonus';
import {Tile} from '../Tile';
import {PlayerId} from '../../common/Types';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceType} from '../../common/boards/SpaceType';
import {SpaceId} from '../../common/Types';

export interface SerializedBoard {
  spaces: Array<SerializedSpace>;
}

export interface SerializedSpace {
  id: SpaceId;
  spaceType: SpaceType;
  tile?: Tile;
  player?: PlayerId;
  bonus: Array<SpaceBonus>;
  adjacency?: AdjacencyBonus,
  x: number;
  y: number;
}
