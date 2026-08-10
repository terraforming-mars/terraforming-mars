import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {IMarsBot} from '../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../automa/MarsBotMilestoneAwardEval';

export class RimSettler extends BaseMilestone {
  constructor() {
    super(
      'Rim Settler',
      'Have 3 Jovian tags in play',
      3);
  }
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.JOVIAN, 'milestone');
  }

  /** The automa rules put MarsBot's threshold at space 5 of its Jovian track. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return marsBotTrackPosition(bot, Tag.JOVIAN) >= 5;
  }
}
