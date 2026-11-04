import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {marsBotAllTrackPositions} from '@/server/automa/MarsBotMilestoneAwardEval';

export class Diversifier extends BaseMilestone {
  public readonly automaDescription = 'Space 3+ on every track (7 of 8 with Venus)';
  constructor() {
    super(
      'Diversifier',
      'Have 8 different tags in play',
      8);
  }
  public getScore(player: IPlayer): number {
    return player.tags.distinctCount('milestone');
  }

  /**
   * MarsBot diversifies by reaching space 3 on 7 of its tracks. That is every track without
   * Venus, which is what Hellas asks for (rulebook C p.9), and 7 of 8 with it (rulebook C p.2),
   * so Hellas and the Milestones & Awards expansion (rulebook C p.13) agree.
   */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return marsBotAllTrackPositions(bot).filter((position) => position >= 3).length >= 7;
  }
}
