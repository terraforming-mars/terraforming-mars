
import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { Resources } from "../Resources";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class SelectResourceDecrease implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public candidates: Array<Player>,
        public game: Game,
        public resource: Resources,
        public count: number = 1,
        public title: string = "Select player to remove up to " + count + " " + resource
    ){
        this.playerInput = new SelectPlayer(
          candidates,
          this.title,
          "Remove",
          (found: Player) => {
            found.setResource(this.resource, -this.count, game, player);
            return undefined;
          }
        );
    };
}    
