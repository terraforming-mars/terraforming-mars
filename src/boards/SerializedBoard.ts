import {IAdjacencyBonus} from '../ares/IAdjacencyBonus';
import {ITile} from '../ITile';
import {PlayerId} from '../common/Types';
import {SpaceBonus} from '../common/boards/SpaceBonus';
import {SpaceType} from '../common/boards/SpaceType';
import {SpaceId} from '../common/Types';

export interface SerializedBoard {
  spaces: Array<SerializedSpace>;
}

export interface SerializedSpace {
  id: SpaceId;
  spaceType: SpaceType;
  tile?: ITile;
  player?: PlayerId;
  bonus: Array<SpaceBonus>;
  adjacency?: IAdjacencyBonus,
  x: number;
  y: number;
}
