import {IActionCard, ICard} from './ICard';
import {CardType} from '../../common/cards/CardType';

export interface IStandardProjectCard extends ICard, IActionCard {
  cardType: CardType.STANDARD_PROJECT;
  cost: number;
}
