import {IActionCard, ICard} from '@/server/cards/ICard';
import {IPlayer} from '@/server/IPlayer';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardType} from '@/common/cards/CardType';

export interface ICeoCard extends IProjectCard, Partial<IActionCard> {
  /** If this card is active this generation. */
  opgActionIsActive?: boolean;

  canAct(player: IPlayer): boolean;
}

export function isCeoCard(card: ICard): card is ICeoCard {
  return card.type === CardType.CEO;
}
