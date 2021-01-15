import {IAdjacencyBonus} from '../ares/IAdjacencyBonus';
import {ITile} from '../ITile';
import {Player, PlayerId} from '../Player';
import {SpaceBonus} from '../SpaceBonus';
import {SpaceType} from '../SpaceType';
import {SpaceId} from './ISpace';

export interface SerializedBoard {
  spaces: Array<SerializedSpace>;
}

export interface SerializedSpace {
  id: SpaceId;
  spaceType: SpaceType;
  tile?: ITile;
  // TODO(kberg): Remove by 2021-01-15
  player?: Player | PlayerId;
  bonus: Array<SpaceBonus>;
  adjacency?: IAdjacencyBonus,
  x: number;
  y: number;
}
