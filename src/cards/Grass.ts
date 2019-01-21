
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Grass implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.PLANT];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Grass";
    public text: string = "Requires -16C or warmer. Increase your plant production 1 step. Gain 3 plants.";
    public description: string = "Taking root in every crevice and patch of soil.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getTemperature() < -16) {
            return Promise.reject("Requires -16C or warmer");
        }
        player.plantProduction++;
        player.plants += 3;
        return Promise.resolve();
    }
}
