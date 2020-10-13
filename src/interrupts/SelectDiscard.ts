import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { SelectCard } from "../inputs/SelectCard";
import { IProjectCard } from "../cards/IProjectCard";

export class SelectDiscard implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title: string = "Select a card to discard",
        public drawBefore: boolean = false
    ){}

    public generatePlayerInput() {
        if (this.drawBefore) {
            this.player.cardsInHand.push(this.game.dealer.dealCard());
        }
        this.playerInput = new SelectCard(this.title, "Discard", this.player.cardsInHand, (foundCards: Array<IProjectCard>) => {
            this.player.cardsInHand.splice(this.player.cardsInHand.indexOf(foundCards[0]), 1);
            this.game.dealer.discard(foundCards[0]);
            return undefined;
        });
    }
}    
