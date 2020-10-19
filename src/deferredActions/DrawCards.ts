import { Game } from "../Game";
import { Player } from "../Player";
import { DeferredAction } from "./DeferredAction";

export class DrawCards implements DeferredAction {
    constructor(
        public player: Player,
        public game: Game,
        public count: number = 1
    ){}

    public execute() {
        for (let i = 0; i < this.count; i++) {
            this.player.cardsInHand.push(this.game.dealer.dealCard());
        }
        return undefined;
    }
}    
