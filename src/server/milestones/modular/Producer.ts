import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {sum} from '../../../common/utils/utils';
import {Units} from '../../../common/Units';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';
import {marsBotMarsTrackPositions} from '../../automa/MarsBotMilestoneAwardEval';

export class Producer extends BaseMilestone {
  constructor() {
    super(
      'Producer',
      'Have a combined total production of at least 16',
      16);
  }

  public getScore(player: IPlayer): number {
    return sum(Units.values(player.production.asUnits()));
  }

  /** MarsBot produces with its three most advanced Mars tracks summing to 16. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    const [first, second, third] = marsBotMarsTrackPositions(bot).sort((a, b) => b - a);
    return first + second + third >= 16;
  }
}
