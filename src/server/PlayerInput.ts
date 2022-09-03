import {ICard} from './cards/ICard';
import {Message} from '../common/logs/Message';
import {PlayerInputType} from '../common/input/PlayerInputType';
import {InputResponse} from '../common/inputs/InputResponse';
import {Player} from './Player';

export interface PlayerInput {
    inputType: PlayerInputType;
    buttonLabel: string;
    options?: Array<PlayerInput>;
    title: string | Message;
    cb: (...item: any) => PlayerInput | undefined;
    /**
     * Processes and validates `response` for this PlayerInput which is meant for the given `player`.
     *
     * This is another mechainsm for calling cb() with a client-side response.
     */
    process: (response: InputResponse, player: Player) => PlayerInput | undefined;
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
