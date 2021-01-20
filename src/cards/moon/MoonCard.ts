import {Player} from '../../Player';
import {TileType} from '../../TileType';
import {Units} from '../../Units';
import {Card, StaticCardProperties} from '../Card';
import {IProjectCard} from '../IProjectCard';
import {IMoonCard} from './IMoonCard';

export interface MoonCardProperties {
  reserveUnits?: Units,
  tilesBuilt?: Array<TileType>
}

export abstract class MoonCard extends Card implements IProjectCard, IMoonCard {
  constructor(properties: StaticCardProperties,
    private moonCardProperties: MoonCardProperties) {
    super(properties);
  }

  public get reserveUnits(): Units {
    return this.moonCardProperties.reserveUnits || Units.EMPTY;
  }

  public get tilesBuilt(): Array<TileType> {
    return this.moonCardProperties.tilesBuilt || [];
  }

  public canPlay(player: Player) {
    return Units.canAdjustProduction(this.productionDelta, player);
  }

  public play(player: Player) {
    Units.deductUnits(this.reserveUnits, player);
    Units.adjustProduction(this.productionDelta, player, player.game);
    return undefined;
  }
}
