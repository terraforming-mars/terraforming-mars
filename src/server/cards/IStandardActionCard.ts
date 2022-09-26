import {IActionCard, ICard} from './ICard';
import {CardType} from '../../common/cards/CardType';

export interface IStandardActionCard extends ICard, IActionCard {
  cardType: CardType.STANDARD_ACTION;
}
