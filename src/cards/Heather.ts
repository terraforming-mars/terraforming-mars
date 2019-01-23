
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
    public description: string = "Stabilizing the soil";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getTemperature() < -14) {
            return Promise.reject("Requires -14C or warmer");
        }
        player.plantProduction++;
        player.plants++;
        return Promise.resolve();
    }
}
