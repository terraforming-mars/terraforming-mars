
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
    public text: string = "The next card you play this generation costs 8 mega credits less. Lose 1 victory point.";
    public description: string = "There are many who would work for us for almost no pay in exchange for a ticket to Mars";
    public play(player: Player, game: Game) {
        let cardHasBeenPlayed: boolean = false;
        let generationHasEnded: boolean = false;
        player.addCardDiscount(() => {
            if (!cardHasBeenPlayed && !generationHasEnded) {
                return 8;
            }
            return 0;
        });
        player.addCardPlayedHandler((card) => {
            if (card.name !== this.name) {
                cardHasBeenPlayed = true;
            }
        });
        game.addGenerationEndListener(() => {
            generationHasEnded = true; 
        });
        player.victoryPoints--;
        return undefined;
    } 
}
