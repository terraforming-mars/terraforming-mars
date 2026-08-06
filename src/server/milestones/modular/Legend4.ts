import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';

export class Legend4 extends BaseMilestone {
  constructor() {
    super(
      'Legend4',
      'Have 4 cards in your event pile',
      4);
  }
  public getScore(player: IPlayer): number {
    return player.getPlayedEventsCount();
  }

  /** MarsBot's events live in its own played pile. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return bot.playedProjectCards.filter((card) => card.type === CardType.EVENT).length >= 4;
  }
}
