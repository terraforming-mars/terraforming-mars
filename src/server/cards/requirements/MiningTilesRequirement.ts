import {IPlayer} from '../../IPlayer';
import {TileType} from '../../../common/TileType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class MiningTilesRequirement extends InequalityRequirement {
  public readonly type = RequirementType.MINING_TILES;
  public override getScore(player: IPlayer): number {
    return MoonExpansion.spaces(player.game, TileType.MOON_MINE, {surfaceOnly: true, ownedBy: this.isAny ? undefined : player}).length;
  }
}
