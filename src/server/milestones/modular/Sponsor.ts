import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';


export class Sponsor extends BaseMilestone {
  constructor() {
    super(
      'Sponsor',
      'Have 3 cards that have cost of 20 M€ or more',
      3);
  }
  public getScore(player: IPlayer): number {
    return player.playedCards.projects()
      .filter((card) => (card.cost >= 20) && (card.type === CardType.ACTIVE || card.type === CardType.AUTOMATED)).length;
  }

  /** MarsBot's cards live in its own played pile, and its events count too. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return bot.playedProjectCards.filter((card) => card.cost >= 20).length >= 3;
  }
}
