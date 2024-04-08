import {CardName} from '../common/cards/CardName';
import {TileType} from '../common/TileType';

export type Tile = {
  tileType: TileType;
  card?: CardName;

  protectedHazard?: boolean; // For Desperate Measures
  rotated?: boolean; // For Crashlanding
  covers?: Tile; // For Ares tiles
}
