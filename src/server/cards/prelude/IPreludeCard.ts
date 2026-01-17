import {ICard} from '@/server/cards/ICard';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardType} from '@/common/cards/CardType';

export interface IPreludeCard extends IProjectCard {
  startingMegaCredits: number;
  type: CardType.PRELUDE;
}

export function isPreludeCard(card: ICard): card is IPreludeCard {
  return card.type === CardType.PRELUDE;
}
