import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { SelectCard } from "../inputs/SelectCard";
import { Game } from "../Game";
import { IProjectCard } from "../cards/IProjectCard";

export class SelectFromCards implements PlayerInterrupt {
    
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title: string,
        public cards: Array<IProjectCard>
    ) {
        this.playerInput = new SelectCard(this.title, "Select", this.cards, (foundCards: Array<IProjectCard>) => {
            player.cardsInHand.push(foundCards[0]);
            this.cards.filter((c) => c !== foundCards[0]).forEach((c) => game.dealer.discard(c));
                return undefined;
            }
        );
    };
}