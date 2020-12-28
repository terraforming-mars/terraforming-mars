
import {Color} from '../Color';
import {TileType} from '../TileType';
import {SpaceBonus} from '../SpaceBonus';
import {SpaceType} from '../SpaceType';

export interface SpaceModel {
    id: string;
    x: number;
    y: number;
    bonus: Array<SpaceBonus>;
    color: Color | undefined;
    tileType: TileType | undefined;
    spaceType: SpaceType;
    isHighlighted: boolean;
}
