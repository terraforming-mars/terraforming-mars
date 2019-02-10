
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";

export class SelectCard<T> implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_CARD;
    constructor(
        public message: string,
        public title: string,
        public cards: Array<T>,
        public cb: (cards: Array<T>) => void,
        public maxCardsToSelect: number = 1,
        public minCardsToSelect: number = 1) {

    }
}
