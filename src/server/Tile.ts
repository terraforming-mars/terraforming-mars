
import {CardName} from '../common/cards/CardName';
import {TileType} from '../common/TileType';

export type Tile = {
  card?: CardName;
  tileType: TileType;
  protectedHazard?: boolean;
  covers?: Tile;
}
