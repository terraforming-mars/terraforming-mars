import { Player } from "../Player";
import { PlayerInput } from "../PlayerInput";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { SelectCard } from "../inputs/SelectCard";
import { Game } from "../Game";
import { IProjectCard } from "../cards/IProjectCard";

export class SelectFromCards implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title: string,
        public cards: Array<IProjectCard>
    ){}

    public generatePlayerInput() {
        this.playerInput = new SelectCard(this.title, "Select", this.cards, (foundCards: Array<IProjectCard>) => {
            this.player.cardsInHand.push(foundCards[0]);
            this.cards.filter((c) => c !== foundCards[0]).forEach((c) => this.game.dealer.discard(c));
                return undefined;
            }
        );
    }
}
