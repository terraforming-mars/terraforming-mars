import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {IMarsBot} from '../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../automa/MarsBotMilestoneAwardEval';

export class Ecologist extends BaseMilestone {
  constructor() {
    super(
      'Ecologist',
      'Have 4 bio tags in play (plant, microbe and animal tags count as bio tags)',
      4);
  }
  public getScore(player: IPlayer): number {
    return player.tags.multipleCount([Tag.PLANT, Tag.ANIMAL, Tag.MICROBE], 'milestone');
  }

  /**
   * MarsBot needs space 4 on its bio track. The class would count that track once per
   * bio tag it carries.
   */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return marsBotTrackPosition(bot, Tag.PLANT) >= 4;
  }
}
