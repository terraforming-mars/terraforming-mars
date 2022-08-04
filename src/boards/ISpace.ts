import {SpaceBonus} from '../common/boards/SpaceBonus';
import {SpaceType} from '../common/boards/SpaceType';
import {Tile} from '../Tile';
import {Player} from '../Player';
import {IAdjacencyBonus} from '../ares/IAdjacencyBonus';
import {SpaceId} from '../common/Types';

export interface ISpace {
    id: SpaceId;
    spaceType: SpaceType;
    tile?: Tile;
    player?: Player;
    bonus: Array<SpaceBonus>;
    adjacency?: IAdjacencyBonus,
    x: number;
    y: number;
}
