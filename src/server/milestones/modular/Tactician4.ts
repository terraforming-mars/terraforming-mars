import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';

export class Tactician4 extends BaseMilestone {
  constructor() {
    super(
      'Tactician4',
      'Have 4 cards with requirements in play',
      4);
  }
  private excludedCardTypes = [CardType.PRELUDE, CardType.EVENT];

  public getScore(player: IPlayer): number {
    const validCards = player.playedCards.filter((card) => {
      const isValidCardType = !this.excludedCardTypes.includes(card.type);
      const hasRequirements = card.requirements.length > 0;

      return isValidCardType && hasRequirements;
    });

    return validCards.length;
  }

  /** MarsBot's cards carry no requirements. It qualifies with 30 M€ on hand. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return bot.mcSupply >= 30;
  }
}
