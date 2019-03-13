
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Moss implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.PLANT];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Moss";
    public text: string = "Requires 3 ocean tiles and that you lose 1 plant. Increase your plant production 1 step. Lose 1 victory point.";
    public description: string = "Efficient soil makers";
    public play(player: Player, game: Game) {
        if (game.getOceansOnBoard() < 3) {
            throw "Requires 3 ocean tiles";
        }
        if (player.plants < 1) {
            throw "Must have a plant to lose";
        }
        player.plants--;
        player.plantProduction++;
        player.victoryPoints--;
        return undefined;
    }
}

