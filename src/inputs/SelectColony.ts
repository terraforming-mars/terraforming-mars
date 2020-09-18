


import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { ColonyName } from "../colonies/ColonyName";
import { IColony } from "../colonies/Colony";

export class SelectColony implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_COLONY;
  
    constructor(
        public title: string,
        public buttonLabel: string = "Save",
        public colonies: Array<IColony>,     
        public cb: (colony: ColonyName) => undefined
        ) {
            this.buttonLabel = buttonLabel;
    }
}
