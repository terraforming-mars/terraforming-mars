import { Game } from "../Game";
import { Player } from "../Player";
import { ColonyName } from "../colonies/ColonyName";
import { SelectColony } from "../inputs/SelectColony";
import { ColonyModel } from "../models/ColonyModel";
import { DeferredAction } from "./DeferredAction";

export class RemoveColonyFromGame implements DeferredAction {
    constructor(
        public player: Player,
        public game: Game
    ){}

    public execute() {
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

        return removeColony;
    }
}    
