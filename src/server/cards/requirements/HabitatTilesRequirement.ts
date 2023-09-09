import {IPlayer} from '../../IPlayer';
import {TileType} from '../../../common/TileType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class HabitatTilesRequirement extends InequalityRequirement {
  public readonly type = RequirementType.HABITAT_TILES;
  public override getScore(player: IPlayer): number {
    return MoonExpansion.spaces(player.game, TileType.MOON_HABITAT, {surfaceOnly: true, ownedBy: this.all ? undefined : player}).length;
  }
}
