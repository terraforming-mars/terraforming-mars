import {MoonExpansion} from '../../moon/MoonExpansion';
import {Player} from '../../Player';
import {TileType} from '../../TileType';
import {Units} from '../../Units';
import {Card, StaticCardProperties} from '../Card';
import {IProjectCard} from '../IProjectCard';
import {IMoonCard} from './IMoonCard';

export interface MoonCardProperties {
  reserveUnits?: Units,
  tilesBuilt?: Array<TileType.MOON_COLONY | TileType.MOON_MINE | TileType.MOON_ROAD>
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
    return super.canPlay(player) && player.canAdjustProduction(this.productionBox);
  }

  public play(player: Player) {
    const adjustedReserveUnits = MoonExpansion.adjustedReserveCosts(player, this);
    player.deductUnits(adjustedReserveUnits);
    player.adjustProduction(this.productionBox, {log: true});
    return undefined;
  }
}
