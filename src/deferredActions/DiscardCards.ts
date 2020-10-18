import { Game } from "../Game";
import { Player } from "../Player";
import { SelectCard } from "../inputs/SelectCard";
import { IProjectCard } from "../cards/IProjectCard";
import { DeferredAction } from "./DeferredAction";

export class DiscardCards implements DeferredAction {
    constructor(
        public player: Player,
        public game: Game,
        public count: number = 1,
        public title: string = "Select " + count + " card" + (count > 1 ? "s" : "") + " to discard"
    ){}

    public execute() {
        return new SelectCard(this.title, "Discard", this.player.cardsInHand, (foundCards: Array<IProjectCard>) => {
            this.player.cardsInHand.splice(this.player.cardsInHand.indexOf(foundCards[0]), 1);
            this.game.dealer.discard(foundCards[0]);
            return undefined;
        }, this.count, this.count);
    }
}    
