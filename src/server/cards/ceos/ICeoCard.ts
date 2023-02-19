import {IActionCard, ICard} from '../ICard';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';

export interface ICeoCard extends IProjectCard, Partial<IActionCard> {
  // TODO: Rename to something that indicates that it's usable even when this value is true.
  /** When true, the card cannot be activated again. */
  isDisabled?: boolean;

  /** If this card is active this generation. */
  opgActionIsActive?: boolean;

  /** The generation the card was activated. Used for Duncan. */
  generationUsed?: number;

  canAct(player: Player): boolean;
}

export function isCeoCard(card: ICard): card is ICeoCard {
  return card.cardType === CardType.CEO;
}
