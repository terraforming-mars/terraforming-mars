import {TileType} from '../../../common/TileType';

export interface IMoonCard {
  tilesBuilt: Array<TileType>;
}

export function isIMoonCard(card: any): card is IMoonCard {
  return Array.isArray(card.tilesBuilt);
}
