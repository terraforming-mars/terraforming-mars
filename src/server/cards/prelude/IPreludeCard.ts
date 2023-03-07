import {ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';

export interface IPreludeCard extends IProjectCard {
  startingMegaCredits: number;
  type: CardType.PRELUDE;
}

export function isPreludeCard(card: ICard): card is IPreludeCard {
  return card.type === CardType.PRELUDE;
}
