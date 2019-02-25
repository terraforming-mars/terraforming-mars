
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Trees implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Trees";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires -4C or warmer. Increase your plant production 3 steps. Gain 1 plant. Gain 1 victory point";
    public description: string = "Providing fruits, wood, and new habitats";
    public play(player: Player, game: Game) {
        if (game.getTemperature() < -4) {
            throw "Requires -4C or warmer";
        }
        player.plantProduction += 3;
        player.plants++;
        player.victoryPoints++;
        return undefined;
    }
}
