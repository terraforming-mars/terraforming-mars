import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {ICard} from '../ICard';

export interface LeaderCard extends IProjectCard {
  // TODO: Rename to something that indicates that it's usable even when this value is true.
  /** When true, the card cannot be activated again. */
  isDisabled?: boolean;

  /** If this card is active this generation. */
  opgActionIsActive?: boolean;

  /** The generation the card was activated. Used for Duncan. */
  generationUsed?: number;

  canAct: (player: Player) => boolean;
}

export function isLeaderCard(card: ICard): card is LeaderCard {
  return card.cardType === CardType.LEADER;
}
