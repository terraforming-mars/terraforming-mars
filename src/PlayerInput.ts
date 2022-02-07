import {ICard} from './cards/ICard';
import {Message} from './common/logs/Message';
import {PlayerInputTypes} from './common/input/PlayerInputTypes';

export interface PlayerInput {
    inputType: PlayerInputTypes;
    buttonLabel: string;
    options?: Array<PlayerInput>;
    title: string | Message;
    cb: (...item: any) => PlayerInput | undefined;
    maxByDefault?: boolean;
}

export namespace PlayerInput {
  export function getCard<T extends ICard>(cards: Array<T>, cardName: string): {card: T, idx: number} {
    const idx = cards.findIndex((card) => card.name === cardName);
    if (idx === -1) {
      throw new Error(`Card ${cardName} not found`);
    }
    const card = cards[idx];
    return {card, idx};
  }
}
