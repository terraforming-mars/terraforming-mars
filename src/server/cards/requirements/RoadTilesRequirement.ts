import {IPlayer} from '@/server/IPlayer';
import {TileType} from '@/common/TileType';
import {MoonExpansion} from '@/server/moon/MoonExpansion';
import {InequalityRequirement} from '@/server/cards/requirements/InequalityRequirement';
import {RequirementType} from '@/common/cards/RequirementType';

/**
 * Evaluate whether the number of road tiles on The Moon is at least (or at most) a given value.
 *
 * Can apply to a single player's tiles or all tiles.
 */
export class RoadTilesRequirement extends InequalityRequirement {
  public readonly type = RequirementType.ROAD_TILES;
  public override getScore(player: IPlayer): number {
    return MoonExpansion.spaces(player.game, TileType.MOON_ROAD, {surfaceOnly: true, ownedBy: this.all ? undefined : player}).length;
  }
}
