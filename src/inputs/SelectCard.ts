
import { PlayerInput } from "../PlayerInput";

export class SelectCard<T> implements PlayerInput {
    constructor(
        public message: string,
        public title: string,
        public cards: Array<T>,
        public cb: (cards: Array<T>) => void,
        public maxCardsToSelect: number = 1,
        public minCardsToSelect: number = 1) {

    }
}
