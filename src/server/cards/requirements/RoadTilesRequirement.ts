import {IPlayer} from '../../IPlayer';
import {TileType} from '../../../common/TileType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class RoadTilesRequirement extends InequalityRequirement {
  public readonly type = RequirementType.ROAD_TILES;
  public override getScore(player: IPlayer): number {
    return MoonExpansion.spaces(player.game, TileType.MOON_ROAD, {surfaceOnly: true, ownedBy: this.all ? undefined : player}).length;
  }
}
