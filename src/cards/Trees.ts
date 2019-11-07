
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Trees implements IProjectCard {
    public cost: number = 13;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Trees";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires -4C or warmer. Increase your plant production 3 steps. Gain 1 plant. Gain 1 victory point";
    public requirements: string = "-4C or warmer";
    public description: string = "Providing fruits, wood, and new habitats";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= -4 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
        player.plantProduction += 3;
        player.plants++;
        player.victoryPoints++;
        return undefined;
    }
}
