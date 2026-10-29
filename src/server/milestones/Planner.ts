import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';
import {Tag} from '@/common/cards/Tag';

export class Planner extends BaseMilestone {
  constructor() {
    super(
      'Planner',
      'Have 16 cards in your hand',
      16);
  }
  public getScore(player: IPlayer): number {
    return player.cardsInHand.length;
  }

  /** Requires space 4 on every track except Venus (rulebook A, p.8; rulebook C, p.2). */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return bot.marsBotBoard.tracks
      .filter((track) => !track.definition.tags.includes(Tag.VENUS))
      .every((track) => track.position >= 4);
  }
}
