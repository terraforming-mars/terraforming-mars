import {Player} from '../../Player';
import {CardRequirement} from './CardRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class RemovedPlantsRequirement extends CardRequirement {
  public readonly type = RequirementType.REMOVED_PLANTS;
  public satisfies(player: Player): boolean {
    return player.game.someoneHasRemovedOtherPlayersPlants;
  }
}
