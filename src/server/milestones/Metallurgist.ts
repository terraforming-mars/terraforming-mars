import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {IMarsBot} from '../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../automa/MarsBotMilestoneAwardEval';

export class Metallurgist extends BaseMilestone {
  constructor() {
    super(
      'Metallurgist',
      'Have a total of 6 steel and titanium production',
      6);
  }

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.titanium;
  }

  /** The automa rules put MarsBot's threshold at 9 across its building and space tracks. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return marsBotTrackPosition(bot, Tag.BUILDING) + marsBotTrackPosition(bot, Tag.SPACE) >= 9;
  }
}
