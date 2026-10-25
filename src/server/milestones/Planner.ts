import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';
import {marsBotTrackPositionsWithoutVenus} from '@/server/automa/MarsBotMilestoneAwardEval';

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

  /**
   * Requires space 4 on every track except Venus, since MarsBot holds no hand
   * (rulebook A, p.8; rulebook C, p.2).
   */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return marsBotTrackPositionsWithoutVenus(bot).every((position) => position >= 4);
  }
}
