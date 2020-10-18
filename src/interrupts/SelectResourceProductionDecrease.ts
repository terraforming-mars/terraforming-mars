import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { Resources } from "../Resources";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class SelectResourceProductionDecrease implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public resource: Resources,
        public count: number = 1,
        public title: string = "Select player to decrease " + resource  + " production by " + count + " step(s)"
    ){}

    public generatePlayerInput() {
        let candidates: Array<Player> = [];
        if (this.resource === Resources.MEGACREDITS) {
            candidates = this.game.getPlayers().filter((p) => p.getProduction(this.resource) >= this.count - 5);
        } else {
            candidates = this.game.getPlayers().filter((p) => p.getProduction(this.resource) >= this.count);
        }

        if (candidates.length === 0) {
            this.playerInput = undefined;
            return;
        } else if (candidates.length === 1) {
            candidates[0].addProduction(this.resource, -this.count, this.game, this.player);
            this.playerInput = undefined;
            return;
        } else {
            this.playerInput = new SelectPlayer(
                candidates,
                this.title,
                "Decrease",
                (found: Player) => {
                    found.addProduction(this.resource, -this.count, this.game, this.player);
                    return undefined;
                }
            );
        }
    }
}    
