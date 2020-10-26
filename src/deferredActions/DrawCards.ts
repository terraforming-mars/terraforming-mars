import { Game } from "../Game";
import { Player } from "../Player";
import { Tags } from "../cards/Tags";
import { IProjectCard } from "../cards/IProjectCard";
import { DeferredAction } from "./DeferredAction";

export class DrawCards implements DeferredAction {
    constructor(
        public player: Player,
        public game: Game,
        public count: number = 1,
        public tag?: Tags
    ){}

    public execute() {
        const drawnCards: Array<IProjectCard> = [];

        if (this.tag !== undefined) {
            for (const foundCard of this.game.drawCardsByTag(this.tag, 2)) {
                drawnCards.push(foundCard);
            }
            this.game.log("${0} drew ${1} and ${2}", b => b.player(this.player).card(drawnCards[0]).card(drawnCards[1]));
        } else {
            for (let i = 0; i < this.count; i++) {
                drawnCards.push(this.game.dealer.dealCard());
            }
            this.game.log("${0} drew ${1} card(s)", b => b.player(this.player).number(this.count));
        }

        this.player.cardsInHand.push(...drawnCards);
        return undefined;
    }
}    
