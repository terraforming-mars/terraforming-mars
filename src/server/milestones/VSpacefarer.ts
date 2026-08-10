import {Tag} from '../../common/cards/Tag';
import {IPlayer} from '../IPlayer';
import {BaseMilestone} from './IMilestone';
import {IMarsBot} from '../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../automa/MarsBotMilestoneAwardEval';

export class VSpacefarer extends BaseMilestone {
  constructor() {
    super(
      'V. Spacefarer',
      'Have 4 space tags in play',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.SPACE, 'milestone');
  }

  /** The automa rules put MarsBot's threshold at space 5 of its space track. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return marsBotTrackPosition(bot, Tag.SPACE) >= 5;
  }
}
