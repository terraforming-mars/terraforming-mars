import {TileType} from '../../../common/TileType';
import {Card, StaticCardProperties} from '../Card';
import {IMoonCard} from './IMoonCard';

export interface MoonCardProperties {
  tilesBuilt?: Array<TileType.MOON_COLONY | TileType.MOON_MINE | TileType.MOON_ROAD>
}

export abstract class MoonCard extends Card implements IMoonCard {
  constructor(properties: StaticCardProperties,
    private moonCardProperties: MoonCardProperties = {}) {
    super(properties);
  }

  public get tilesBuilt(): Array<TileType> {
    return this.moonCardProperties.tilesBuilt || [];
  }
}
