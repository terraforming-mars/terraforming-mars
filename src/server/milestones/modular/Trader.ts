import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../../automa/MarsBotMilestoneAwardEval';

export class Trader extends BaseMilestone {
  constructor() {
    super(
      'Trader',
      'Have 3 different types of resources on cards',
      3);
  }

  public getScore(player: IPlayer): number {
    const nonStandardResources = new Set(player.getCardsWithResources().map((card) => card.resourceType));
    return nonStandardResources.size;
  }

  /** MarsBot trades by reaching space 2 on its bio, earth and Venus tracks. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return [Tag.PLANT, Tag.EARTH, Tag.VENUS].every((tag) => marsBotTrackPosition(bot, tag) >= 2);
  }
}
