import {IActionCard, ICard} from '@/server/cards/ICard';
import {CardType} from '@/common/cards/CardType';

export interface IStandardProjectCard extends ICard, IActionCard {
  type: CardType.STANDARD_PROJECT;
  cost: number;
}
