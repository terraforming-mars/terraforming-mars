
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";

export class SelectOption implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_OPTION;
    constructor(public title: string, public message: string, public cb: () => void) {
    }
}

