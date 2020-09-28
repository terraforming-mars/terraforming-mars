import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { Player } from "../Player";
import { IAresGlobalParametersResponse } from "../interrupts/ShiftAresGlobalParametersInterrupt";
import { AresData } from "../ares/AresData";

export class ShiftAresGlobalParameters implements PlayerInput {
    public inputType = PlayerInputTypes.SHIFT_ARES_GLOBAL_PARAMETERS;
    public title = "Adjust Ares global parameters up to 1 step.";
    public buttonLabel = "Save";

    constructor(
        public player: Player,
        public aresData: AresData,
        public cb: (units: IAresGlobalParametersResponse) => undefined) {}

}