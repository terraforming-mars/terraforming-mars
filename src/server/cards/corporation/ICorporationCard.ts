import {ICard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardType} from '../../../common/cards/CardType';
import {Behavior} from '../../behavior/Behavior';

export interface ICorporationCard extends ICard {
  type: CardType.CORPORATION;
  initialActionText?: string;
  initialAction?(player: IPlayer): PlayerInput | undefined;
  firstAction?: Behavior,
  startingMegaCredits: number;
  cardCost?: number;
  // TODO(kberg): Remove after 2027-04-01
  onCardPlayedForCorps?: never;
}

export function isICorporationCard(card: ICard): card is ICorporationCard {
  return card.type === CardType.CORPORATION;
}
