import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { IColony } from "../colonies/Colony";
import { SelectColony } from "../inputs/SelectColony";
import { ColonyName } from "../colonies/ColonyName";

export class SelectColonyInterrupt implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public openColonies: Array<IColony>,
        public tile: string = "Select where to build a colony"
    ){
        let buildColony = new SelectColony(game, tile, "Build", openColonies, (colonyName: ColonyName) => {
                openColonies.forEach(colony => {
                  if (colony.name === colonyName) {
                    colony.onColonyPlaced(player, game);
                  }
                  return undefined;
                });
                return undefined;
            });            
        this.playerInput = buildColony;
    };
}    
