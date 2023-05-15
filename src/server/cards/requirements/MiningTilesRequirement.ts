import {Player} from '../../Player';
import {TileType} from '../../../common/TileType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class MiningTilesRequirement extends InequalityRequirement {
  public readonly type = RequirementType.MINING_TILES;
  public override getScore(player: Player): number {
    return MoonExpansion.spaces(player.game, TileType.MOON_MINE, {surfaceOnly: true, ownedBy: this.isAny ? undefined : player}).length;
  }
}
