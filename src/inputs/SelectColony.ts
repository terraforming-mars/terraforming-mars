


import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { ColonyName } from "../colonies/ColonyName";
import { ColonyModel } from "../models/ColonyModel";
import { Game } from "../Game";


export class SelectColony implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_COLONY;
  
    constructor(
        public game: Game,
        public title: string,
        public buttonLabel: string = "Save",
        public coloniesModel: Array<ColonyModel>,     
        public cb: (colony: ColonyName) => undefined
        ) {
            this.buttonLabel = buttonLabel;
        }
}
