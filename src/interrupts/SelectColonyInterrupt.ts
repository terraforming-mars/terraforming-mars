import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { IColony } from "../colonies/Colony";
import { SelectColony } from "../inputs/SelectColony";
import { ColonyName } from "../colonies/ColonyName";
import { ColonyModel } from "../models/ColonyModel";

export class SelectColonyInterrupt implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public openColonies: Array<IColony>,
        public title: string = "Select where to build a colony"
    ){}

    public generatePlayerInput() {
        let coloniesModel: Array<ColonyModel> = this.game.getColoniesModel(this.openColonies);
        this.playerInput = new SelectColony(this.title, "Build", coloniesModel, (colonyName: ColonyName) => {
            this.openColonies.forEach(colony => {
                if (colony.name === colonyName) {
                    colony.onColonyPlaced(this.player, this.game);
                }
                return undefined;
            });
            return undefined;
        });            
    }
}    
