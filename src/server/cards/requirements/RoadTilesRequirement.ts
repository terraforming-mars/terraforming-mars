import {Player} from '../../Player';
import {TileType} from '../../../common/TileType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class RoadTilesRequirement extends InequalityRequirement {
  public readonly type = RequirementType.ROAD_TILES;
  public override getScore(player: Player): number {
    return MoonExpansion.spaces(player.game, TileType.MOON_ROAD, {surfaceOnly: true, ownedBy: this.isAny ? undefined : player}).length;
  }
}
