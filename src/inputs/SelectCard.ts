

import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";

export class SelectCard<T> implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_CARD;
    constructor(
        public title: string,
        public cards: Array<T>,
        public cb: (cards: Array<T>) => PlayerInput | undefined,
        public maxCardsToSelect: number = 1,
        public minCardsToSelect: number = 1) {

    }
}
