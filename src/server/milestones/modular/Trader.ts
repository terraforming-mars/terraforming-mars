import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Trader extends BaseMilestone {
  public readonly automaDescription = 'Bio, Earth and Venus tracks ≥ 2';
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

  /** MarsBot needs space 2 on its Bio, Earth and Venus tracks (rulebook C p.14). */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return [Tag.PLANT, Tag.EARTH, Tag.VENUS].every((tag) => bot.marsBotBoard.trackPosition(tag) >= 2);
  }
}
