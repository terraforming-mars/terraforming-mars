
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Heather implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Heather";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires -14C or warmer. Increase your plant production 1 step. Gain 1 plant.";
    public requirements: string = "-14C or Warmer";
    public description: string = "Stabilizing the soil";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= -14 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
        player.plantProduction++;
        player.plants++;
        return undefined;
    }
}
