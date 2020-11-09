
import {TileType} from './TileType';

export interface ITile {
    card?: string;
    tileType: TileType;
    protectedHazard?: boolean;
}
