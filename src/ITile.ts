
import {TileType} from './common/TileType';

export interface ITile {
  card?: string;
  tileType: TileType;
  protectedHazard?: boolean;
  covers?: ITile;
}
