import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { ColonyName } from "../colonies/ColonyName";
import { SelectColony } from "../inputs/SelectColony";
import { ColonyModel } from "../models/ColonyModel";

export class SelectRemoveColony implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game
    ){}

    public generatePlayerInput() {
        let coloniesModel: Array<ColonyModel> = this.game.getColoniesModel(this.game.colonies);
        let removeColony = new SelectColony("Select colony to remove", "Remove colony", coloniesModel, (colonyName: ColonyName) => {
            this.game.colonies.forEach(colony => {
                if (colony.name === colonyName) {
                    this.game.colonies.splice(this.game.colonies.indexOf(colony),1);
                    if (this.game.colonyDealer === undefined) return;
                    this.game.colonyDealer.discardedColonies.push(colony);
                }
                return undefined;
            });
            return undefined;
        });

        this.playerInput = removeColony;
    }
}    
