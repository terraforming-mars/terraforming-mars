import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceType} from '../../common/boards/SpaceType';
import {Tile} from '../Tile';
import {Player} from '../Player';
import {AdjacencyBonus} from '../ares/AdjacencyBonus';
import {SpaceId} from '../../common/Types';

export interface ISpace {
    id: SpaceId;
    spaceType: SpaceType;
    tile?: Tile;
    player?: Player;
    bonus: Array<SpaceBonus>;
    adjacency?: AdjacencyBonus,
    x: number;
    y: number;
}
