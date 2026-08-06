import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '../automa/MarsBotCorpTypes';
import {marsBotAllTrackPositions} from '../automa/MarsBotMilestoneAwardEval';

export class Diversifier extends BaseMilestone {
  constructor() {
    super(
      'Diversifier',
      'Have 8 different tags in play',
      8);
  }
  public getScore(player: IPlayer): number {
    return player.tags.distinctCount('milestone');
  }

  /** MarsBot diversifies by reaching space 3 on 7 of its tracks. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return marsBotAllTrackPositions(bot).filter((position) => position >= 3).length >= 7;
  }
}
