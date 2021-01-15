
import {Color} from '../Color';
import {TileType} from '../TileType';
import {SpaceBonus} from '../SpaceBonus';
import {SpaceType} from '../SpaceType';
import {SpaceId} from '../boards/ISpace';

export type SpaceHighlight = undefined | 'noctis' | 'volcanic';

export interface SpaceModel {
    id: SpaceId;
    x: number;
    y: number;
    bonus: Array<SpaceBonus>;
    color: Color | undefined;
    tileType: TileType | undefined;
    spaceType: SpaceType;
    highlight: SpaceHighlight;
}
