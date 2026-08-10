import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '../automa/MarsBotCorpTypes';
import {marsBotMarsTrackPositions} from '../automa/MarsBotMilestoneAwardEval';

export class Planner extends BaseMilestone {
  constructor() {
    super(
      'Planner',
      'Have 16 cards in your hand',
      16);
  }
  public getScore(player: IPlayer): number {
    return player.cardsInHand.length;
  }

  /** MarsBot has no hand. It plans by advancing every Mars track to at least 4. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return marsBotMarsTrackPositions(bot).every((position) => position >= 4);
  }
}
