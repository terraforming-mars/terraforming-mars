
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { HowToPay } from "./HowToPay";
import { SelectSpace } from "./SelectSpace";

export class SelectHowToPay implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_HOW_TO_PAY;
    public onend?: () => void;  
    constructor(
        public title: string,
        public canUseSteel: boolean,
        public canUseTitanium: boolean,
        public canUseHeat: boolean,
        public canUseMicrobes: boolean,
        public cb: (howToPay: HowToPay) => SelectSpace | undefined,
        public amount: number = 0) {

    }
}

