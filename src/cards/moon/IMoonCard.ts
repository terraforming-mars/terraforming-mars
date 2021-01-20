import {TileType} from '../../TileType';
import {Units} from '../../Units';

export interface IMoonCard {
  tilesBuilt: Array<TileType>;
  reserveUnits: Units;
}
