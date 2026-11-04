import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {CardType} from '../../common/cards/CardType';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Tactician extends BaseMilestone {
  public readonly automaDescription = '35+ M€';
  constructor() {
    super(
      'Tactician',
      'Have 5 cards with requirements in play',
      5);
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

  /** MarsBot needs 35 M€ on hand, since its cards carry no requirements (rulebook C p.9). */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return bot.megacredits >= 35;
  }
}
