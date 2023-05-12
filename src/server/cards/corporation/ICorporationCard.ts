import {ICard} from '../ICard';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardType} from '../../../common/cards/CardType';
import {SerializedCard} from '../../SerializedCard';
import {Behavior} from '../../behavior/Behavior';

export interface ICorporationCard extends ICard {
  initialActionText?: string;
  initialAction?: (player: Player) => PlayerInput | undefined;
  firstAction?: Behavior,
  startingMegaCredits: number;
  cardCost?: number;
  onCorpCardPlayed?: (player: Player, card: ICorporationCard) => PlayerInput | undefined;
  onProductionPhase?: (player: Player) => undefined; // For Pristar
  isDisabled?: boolean;

  serialize?(serialized: SerializedCard): void;
  deserialize?(serialized: SerializedCard): void;
}

export function isICorporationCard(card: ICard): card is ICorporationCard {
  return card.type === CardType.CORPORATION;
}
