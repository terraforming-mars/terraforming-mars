import {Tag} from '../../common/cards/Tag';
import {IPlayer} from '../IPlayer';
import {BaseMilestone} from './IMilestone';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class VSpacefarer extends BaseMilestone {
  public readonly automaDescription = 'Space track ≥ 5';
  constructor() {
    super(
      'V. Spacefarer',
      'Have 4 space tags in play',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.SPACE, 'milestone');
  }

  /** Rulebook C p.10. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return bot.marsBotBoard.trackPosition(Tag.SPACE) >= 5;
  }
}
