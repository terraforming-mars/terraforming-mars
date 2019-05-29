
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { SelectSpace } from "./SelectSpace";

export class SelectOption implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_OPTION;
    constructor(public title: string, public cb: () => SelectSpace | undefined) {
    }
}

