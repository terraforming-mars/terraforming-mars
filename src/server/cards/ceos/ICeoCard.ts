import {IActionCard, ICard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';

export interface ICeoCard extends IProjectCard, Partial<IActionCard> {
  /** If this card is active this generation. */
  opgActionIsActive?: boolean;

  /** The generation the card was activated. Used for Duncan. */
  generationUsed?: number;

  canAct(player: IPlayer): boolean;
}

export function isCeoCard(card: ICard): card is ICeoCard {
  return card.type === CardType.CEO;
}
