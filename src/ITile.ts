
import { TileType } from "./TileType";

export interface ITile {
    card?: string;
    tileType: TileType;
    hazard?: boolean;
}
