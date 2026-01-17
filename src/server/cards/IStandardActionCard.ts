import {IActionCard, ICard} from '@/server/cards/ICard';
import {CardType} from '@/common/cards/CardType';

export interface IStandardActionCard extends ICard, IActionCard {
  type: CardType.STANDARD_ACTION;
}
