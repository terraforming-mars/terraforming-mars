import {IPlayer} from '@/server/IPlayer';
import {CardRequirement} from '@/server/cards/requirements/CardRequirement';
import {RequirementType} from '@/common/cards/RequirementType';

/**
 * Evaluate whether any player's plants have been removed this generation.
 */
export class RemovedPlantsRequirement extends CardRequirement {
  public readonly type = RequirementType.REMOVED_PLANTS;
  public satisfies(player: IPlayer): boolean {
    return player.game.someoneHasRemovedOtherPlayersPlants;
  }
}
