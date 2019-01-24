
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class ArcticAlgae implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Arctic Algae";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "It must be -12C or colder to play. Gain 1 plant. When anyone places an ocean tile, gain 2 plants.";
    public description: string = "Suitable for freezing temperatures.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getTemperature() > -12) {
            return Promise.reject("It must be -12C or colder to play");
        }
        player.plants++;
        game.addOceanTilePlacedListener(() => {
            player.plants += 2;
        });
        return Promise.resolve();
    }
}
