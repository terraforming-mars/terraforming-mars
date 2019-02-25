
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { HowToPay } from "./HowToPay";

export class SelectHowToPay implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_HOW_TO_PAY;
    constructor(
        public message: string,
        public title: string,
        public canUseSteel: boolean,
        public canUseTitanium: boolean,
        public canUseHeat: boolean,
        public cb: (howToPay: HowToPay) => PlayerInput | undefined) {

    }
}

