import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Ecologist extends BaseMilestone {
  public readonly automaDescription = 'Bio track ≥ 4';
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
   * MarsBot needs space 4 of its Bio track (rulebook C p.9 and p.13).
   *
   * Counting bio tags would count that one track once for each of its three tags.
   */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.marsBotBoard.trackPosition(Tag.PLANT) >= 4;
  }
}
