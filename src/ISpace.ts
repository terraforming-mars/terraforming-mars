
import {SpaceBonus} from './SpaceBonus';
import {SpaceType} from './SpaceType';
import {ITile} from './ITile';
import {PlayerId} from './Player';
import {IAdjacencyBonus} from './ares/IAdjacencyBonus';

export interface ISpace {
    id: string;
    spaceType: SpaceType;
    tile?: ITile;
    player?: PlayerId;
    bonus: Array<SpaceBonus>;
    adjacency?: IAdjacencyBonus,
    x: number;
    y: number;
}
