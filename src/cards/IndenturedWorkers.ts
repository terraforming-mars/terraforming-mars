
import { CardType } from "./CardType";
import { Player } from "../Player";
import { IProjectCard } from "./IProjectCard"
;
import { CardDiscount } from "../CardDiscount";

import { Tags } from "./Tags";
import { Game } from "../Game";

export class IndenturedWorkers implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 0;
    public tags: Array<Tags> = [];
    public name: string = "Indentured Workers";
    public text: string = "The next card you play this generation costs 8 mega credits less";
    public description: string = "There are many who would work for us for almost no pay in exchange for a ticket to Mars";
    public play(player: Player, game: Game): void {
        var discount: CardDiscount = function(card: IProjectCard) {
            return 8;
        }
        var afterGeneration = function() {
            player.removeCardDiscount(discount);
            game.removeGenerationEndListener(afterGeneration);
        }
        player.addCardDiscount(discount);
        game.addGenerationEndListener(afterGeneration);
        player.victoryPoints--;
    } 
}
