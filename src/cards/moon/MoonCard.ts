import {Player} from '../../Player';
import {TileType} from '../../TileType';
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

  public canPlay(player: Player) {
    return super.canPlay(player) && player.canAdjustProduction(this.productionBox);
  }

  public play(player: Player) {
    super.play(player);
    player.adjustProduction(this.productionBox, {log: true});
    return undefined;
  }
}
