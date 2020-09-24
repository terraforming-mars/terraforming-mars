import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { ColonyName } from "../colonies/ColonyName";
import { SelectColony } from "../inputs/SelectColony";
import { ColonyModel } from "../models/ColonyModel";

export class SelectRemoveColony implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game
    ){
        let coloniesModel: Array<ColonyModel> = game.getColoniesModel(game.colonies);
        let removeColony = new SelectColony("Select colony to remove", "Remove colony", coloniesModel, (colonyName: ColonyName) => {
            game.colonies.forEach(colony => {
              if (colony.name === colonyName) {
                game.colonies.splice(game.colonies.indexOf(colony),1);
                if (game.colonyDealer === undefined) return;
                game.colonyDealer.discardedColonies.push(colony);
              }
              return undefined;
            });
            return undefined;
        });

        this.playerInput = removeColony;
    };
}    



