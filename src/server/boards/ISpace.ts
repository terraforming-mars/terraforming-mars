import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceType} from '../../common/boards/SpaceType';
import {Tile} from '../Tile';
import {AdjacencyBonus} from '../ares/AdjacencyBonus';
import {SpaceId} from '../../common/Types';
import {IPlayer} from '../IPlayer';

export interface ISpace {
    id: SpaceId;
    spaceType: SpaceType;
    tile?: Tile;
    player?: IPlayer;
    bonus: Array<SpaceBonus>;
    adjacency?: AdjacencyBonus,
    x: number;
    y: number;
}
