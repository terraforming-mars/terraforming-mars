
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { HowToPay } from "./HowToPay";
import { IProjectCard } from "../cards/IProjectCard";

export class SelectHowToPayForCard implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_CARD;
    public title: string = "Play project card";
    constructor(
        public cards: Array<IProjectCard>,
        public microbes: number,
        public floaters: number,
        public canUseHeat: boolean,
        public cb: (cardToPlay: IProjectCard, howToPay: HowToPay) => PlayerInput | undefined) {
    }
}

