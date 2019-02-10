
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";

export class DoNothing implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.DO_NOTHING;
    constructor(public message: string, public title: string, public cb: () => void) {

    }
}
