
import {CardName} from './common/cards/CardName';
import {TileType} from './common/TileType';

export interface ITile {
  card?: CardName;
  tileType: TileType;
  protectedHazard?: boolean;
  covers?: ITile;
}
