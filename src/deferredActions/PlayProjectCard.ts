import { Game } from "../Game";
import { Player } from "../Player";
import { DeferredAction } from "./DeferredAction";

export class PlayProjectCard implements DeferredAction {
    constructor(
        public player: Player,
        public game: Game
    ){}

    public execute() {
        if (this.player.getPlayableCards(this.game).length === 0) {
            return undefined;
        }
        return this.player.playProjectCard(this.game);
    }
}    
