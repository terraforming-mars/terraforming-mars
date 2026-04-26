import {ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';

export interface ICeoCard extends IProjectCard {
  type: CardType.CEO;
  /** If this card is active this generation. */
  opgActionIsActive?: boolean;
}

export function isCeoCard(card: ICard): card is ICeoCard {
  return card.type === CardType.CEO;
}
