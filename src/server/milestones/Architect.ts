import {TagBasedMilestone} from './TagBasedMilestone';
import {Tag} from '../../common/cards/Tag';
import {IMarsBot} from '../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../automa/MarsBotMilestoneAwardEval';

export class Architect extends TagBasedMilestone {
  constructor() {
    super('Architect', 'Have 3 city tags in play', 3, [Tag.CITY]);
  }

  /** The automa rules put MarsBot's threshold at space 6 of its city-tag track. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return marsBotTrackPosition(bot, Tag.CITY) >= 6;
  }
}
