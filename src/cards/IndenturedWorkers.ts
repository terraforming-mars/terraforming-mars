
import { CardType } from "./CardType";
import { Player } from "../Player";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Game } from "../Game";

export class IndenturedWorkers implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 0;
    public tags: Array<Tags> = [];
    public name: string = "Indentured Workers";

    public getCardDiscount(player: Player, game: Game) {
        const lastCardPlayed = player.lastCardPlayedThisGeneration(game);
        if (lastCardPlayed !== undefined && lastCardPlayed.name === this.name) {
            return 8;
        }
        return 0;
    }
    public play() {
        return undefined;
    } 
    public getVictoryPoints() {
        return -1;
    }
}
