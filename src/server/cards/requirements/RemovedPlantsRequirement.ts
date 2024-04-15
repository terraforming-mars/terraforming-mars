import {IPlayer} from '../../IPlayer';
import {CardRequirement} from './CardRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

/**
 * Evaluate whether any player's plants have been removed this generation.
 */
export class RemovedPlantsRequirement extends CardRequirement {
  public readonly type = RequirementType.REMOVED_PLANTS;
  public satisfies(player: IPlayer): boolean {
    return player.game.someoneHasRemovedOtherPlayersPlants;
  }
}
