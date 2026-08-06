import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../../automa/MarsBotMilestoneAwardEval';

export class Farmer extends BaseMilestone {
  constructor() {
    super(
      'Farmer',
      'Have 5 animal and microbe resources on your cards',
      5);
  }
  public getScore(player: IPlayer): number {
    return player.getResourceCount(CardResource.MICROBE) + player.getResourceCount(CardResource.ANIMAL);
  }

  /** MarsBot has no card resources. It farms by reaching space 7 on its bio track. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return marsBotTrackPosition(bot, Tag.PLANT) >= 7;
  }
}
