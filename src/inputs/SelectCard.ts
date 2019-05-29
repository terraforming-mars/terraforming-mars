
import { AndOptions } from "./AndOptions";
import { IProjectCard } from "../cards/IProjectCard";
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { SelectAmount } from "./SelectAmount";
import { SelectHowToPay } from "./SelectHowToPay";
import { SelectPlayer } from "./SelectPlayer";
import { SelectSpace } from "./SelectSpace";

export class SelectCard<T> implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_CARD;
    public onend?: () => void;
    constructor(
        public title: string,
        public cards: Array<T>,
        public cb: (cards: Array<T>) => AndOptions | SelectAmount | SelectCard<IProjectCard> | SelectHowToPay | SelectSpace | SelectPlayer | undefined,
        public maxCardsToSelect: number = 1,
        public minCardsToSelect: number = 1) {

    }
}
