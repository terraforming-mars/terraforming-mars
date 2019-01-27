
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { IProjectCard } from "../cards/IProjectCard";

export class SelectCard implements PlayerInput {
    public initiator: "card" | "board" = "card";
    public type: PlayerInputTypes = "SelectACard";
    constructor(
        public card: IProjectCard,
        public title: string,
        public cards: Array<IProjectCard>,
        public cb: (cards: Array<IProjectCard>) => void,
        public maxCardsToSelect: number = 1) {

    }
}
