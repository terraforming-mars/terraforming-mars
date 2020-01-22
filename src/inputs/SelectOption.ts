
import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { SelectSpace } from "./SelectSpace";
import { SelectHowToPay } from './SelectHowToPay';
import { AndOptions } from './AndOptions';

export class SelectOption implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_OPTION;
    public onend?: () => void;
    constructor(public title: string, public cb: () => SelectSpace | SelectHowToPay | AndOptions | undefined) {
    }
}

