
import { PlayerInput } from "../PlayerInput";
import { HowToPay } from "./HowToPay";

export class SelectHowToPay implements PlayerInput {
    constructor(
        public message: string,
        public title: string,
        public canUseSteel: boolean,
        public canUseTitanium: boolean,
        public canUseHeat: boolean,
        public cb: (howToPay: HowToPay) => void) {

    }
}

