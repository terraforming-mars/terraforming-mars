
import { PlayerInput } from "../PlayerInput";
import { ISpace } from "../ISpace";
import { PlayerInputTypes } from "../PlayerInputTypes";

export class SelectSpace implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_SPACE;
    constructor(public title: string, public message: string, public availableSpaces: Array<ISpace>, public cb: (space: ISpace) => void) {

    }
}
