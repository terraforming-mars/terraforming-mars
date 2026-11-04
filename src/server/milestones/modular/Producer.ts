import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {sum} from '../../../common/utils/utils';
import {Units} from '../../../common/Units';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {marsBotMarsTrackPositions} from '@/server/automa/MarsBotMilestoneAwardEval';

export class Producer extends BaseMilestone {
  public readonly automaDescription = '3+ tracks (except Venus) ≥ 16';
  constructor() {
    super(
      'Producer',
      'Have a combined total production of at least 16',
      16);
  }

  public getScore(player: IPlayer): number {
    return sum(Units.values(player.production.asUnits()));
  }

  /** MarsBot needs its top three tracks other than Venus at 16 or more (rulebook C p.14). */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    const [first, second, third] = marsBotMarsTrackPositions(bot).sort((a, b) => b - a);
    return first + second + third >= 16;
  }
}
