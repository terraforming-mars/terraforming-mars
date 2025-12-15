import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';
import {sum} from '../../../common/utils/utils';
import {PlayerId} from '../../../common/Types';

/**
 * Evaluates whether this player* has a given number of colonies all colony tiles.
 *
 * * Or any player, when _all_ is true.
 */
export class ColoniesRequirement extends InequalityRequirement {
  public readonly type = RequirementType.COLONIES;
  public override getScore(player: IPlayer): number {
    const filter = (this.all) ? () => true : (owner: PlayerId) => owner === player.id;
    return sum(player.game.colonies
      .map((colony) => colony.colonies.filter(filter).length));
  }
}
