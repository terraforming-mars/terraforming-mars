import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../../automa/MarsBotMilestoneAwardEval';

export class Fundraiser extends BaseMilestone {
  constructor() {
    super(
      'Fundraiser',
      'Have 12 M€ production',
      12);
  }
  public getScore(player: IPlayer): number {
    return player.production.megacredits;
  }

  /** The automa rules put MarsBot's threshold at space 8 of its M€ track. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return marsBotTrackPosition(bot, Tag.EVENT) >= 8;
  }
}
