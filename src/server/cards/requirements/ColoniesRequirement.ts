import {Player} from '../../Player';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';
import {sum} from '../../../common/utils/utils';

export class ColoniesRequirement extends InequalityRequirement {
  public readonly type = RequirementType.COLONIES;
  public override getScore(player: Player): number {
    return sum(player.game.colonies
      .map((colony) => colony.colonies.filter((owner) => owner === player.id).length));
  }
}

