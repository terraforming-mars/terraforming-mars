import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';
import {sum} from '../../../common/utils/utils';

/**
 * Evaluates whether this player has a given number of colonies all colony tiles.
 */
export class ColoniesRequirement extends InequalityRequirement {
  public readonly type = RequirementType.COLONIES;
  public override getScore(player: IPlayer): number {
    return sum(player.game.colonies
      .map((colony) => colony.colonies.filter((owner) => owner === player.id).length));
  }
}
