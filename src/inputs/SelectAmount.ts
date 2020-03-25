
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";

export class SelectAmount implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_AMOUNT;
    constructor(
        public title: string,
        public cb: (amount: number) => undefined,
        public max: number) {
    }
}
