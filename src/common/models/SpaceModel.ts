import {Color} from '../Color';
import {TileType} from '../TileType';
import {SpaceBonus} from '../boards/SpaceBonus';
import {SpaceType} from '../boards/SpaceType';
import {SpaceId} from '../Types';

export type SpaceHighlight = undefined | 'noctis' | 'volcanic';

export type SpaceModel = {
    id: SpaceId;
    x: number;
    y: number;
    bonus: Array<SpaceBonus>;
    color: Color | undefined;
    tileType: TileType | undefined;
    spaceType: SpaceType;
    highlight: SpaceHighlight;
}
