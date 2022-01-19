import {Player} from '../../Player';
import {TileType} from '../../common/TileType';
import {StaticCardProperties} from '../Card';
import {ProjectCard} from '../ProjectCard';
import {IMoonCard} from './IMoonCard';

export interface MoonCardProperties {
  tilesBuilt?: Array<TileType.MOON_COLONY | TileType.MOON_MINE | TileType.MOON_ROAD>
}

export abstract class MoonCard extends ProjectCard implements IMoonCard {
  constructor(properties: StaticCardProperties,
    private moonCardProperties: MoonCardProperties = {}) {
    super(properties);
  }

  public get tilesBuilt(): Array<TileType> {
    return this.moonCardProperties.tilesBuilt || [];
  }

  public override canPlay(player: Player) {
    return player.canAdjustProduction(this.productionBox);
  }

  public override play(player: Player) {
    super.play(player);
    player.adjustProduction(this.productionBox, {log: true});
    return undefined;
  }
}
