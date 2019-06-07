
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class TundraFarming implements IProjectCard {
    public cost: number = 16;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Tundra Farming";
    public text: string = "Requires -6C or warmer. Increase your plant production 1 step and your mega credit production 2 steps. Gain 1 plant. Gain 2 victory points.";
    public description: string = "Farming the thawed soil over the frozen bedrock";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= -6 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
        player.plantProduction++;
        player.megaCreditProduction += 2;
        player.plants++;
        player.victoryPoints += 2;
        return undefined;
    }
} 
