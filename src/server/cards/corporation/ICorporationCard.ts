import {ICard} from '@/server/cards/ICard';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {CardType} from '@/common/cards/CardType';
import {Behavior} from '@/server/behavior/Behavior';
import {SerializedCard} from '@/server/SerializedCard';

export interface ICorporationCard extends ICard {
  type: CardType.CORPORATION;
  initialActionText?: string;
  initialAction?(player: IPlayer): PlayerInput | undefined;
  firstAction?: Behavior,
  startingMegaCredits: number;
  cardCost?: number;
  onCardPlayedForCorps?(player: IPlayer, card: ICard): PlayerInput | undefined | void;
  onCardPlayed?: never;

  serialize?(serialized: SerializedCard): void;
  deserialize?(serialized: SerializedCard): void;
}

export function isICorporationCard(card: ICard): card is ICorporationCard {
  return card.type === CardType.CORPORATION;
}
