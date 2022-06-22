import {SpaceBonus} from '../common/boards/SpaceBonus';
import {SpaceType} from '../common/boards/SpaceType';
import {ITile} from '../ITile';
import {Player} from '../Player';
import {IAdjacencyBonus} from '../ares/IAdjacencyBonus';
import {SpaceId} from '../common/Types';

export interface ISpace {
    id: SpaceId;
    spaceType: SpaceType;
    tile?: ITile;
    player?: Player;
    bonus: Array<SpaceBonus>;
    adjacency?: IAdjacencyBonus,
    x: number;
    y: number;
}
