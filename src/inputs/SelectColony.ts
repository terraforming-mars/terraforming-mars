


import { PlayerInput } from "../PlayerInput";
import { PlayerInputTypes } from "../PlayerInputTypes";
import { ColonyName } from "../colonies/ColonyName";
import { IColony } from "../colonies/Colony";
import { ColonyModel } from "../models/ColonyModel";
import { Game } from "../Game";
import { Color } from "../Color";

export class SelectColony implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_COLONY;
    public coloniesModel: Array<ColonyModel> = [];
  
    constructor(
        public game: Game,
        public title: string,
        public buttonLabel: string = "Save",
        public colonies: Array<IColony>,     
        public cb: (colony: ColonyName) => undefined
        ) {
            this.buttonLabel = buttonLabel;
            this.coloniesModel = colonies.map(
                (colony): ColonyModel => ({
                    colonies: colony.colonies.map(
                        (playerId): Color => game.getPlayerById(playerId).color
                    ),
                    isActive: colony.isActive,
                    name: colony.name,
                    trackPosition: colony.trackPosition,
                    visitor:
                        colony.visitor === undefined
                            ? undefined
                            : game.getPlayerById(colony.visitor).color,
                })
            );
    }
}
