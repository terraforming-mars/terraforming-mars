import {ICard} from '../ICard';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardType} from '../../../common/cards/CardType';

export interface ICorporationCard extends ICard {
  initialActionText?: string;
  initialAction?: (player: Player) => PlayerInput | undefined;
  startingMegaCredits: number;
  cardCost?: number;
  onCorpCardPlayed?: (player: Player, card: ICorporationCard) => PlayerInput | undefined;
  onProductionPhase?: (player: Player) => undefined; // For Pristar
  isDisabled?: boolean;
}

export function isICorporationCard(card: ICard): card is ICorporationCard {
  return card.cardType === CardType.CORPORATION;
}
