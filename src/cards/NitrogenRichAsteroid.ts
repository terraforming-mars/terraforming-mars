
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class NitrogenRichAsteroid implements IProjectCard {
    public cost: number = 31;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Nitrogen-Rich Asteroid";
    public cardType: CardType = CardType.EVENT;
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        player.terraformRating += 2;
        if (player.getTagCount(Tags.PLANT) < 3) {
            player.plantProduction++;
        } else {
            player.plantProduction += 4;
        }
        return game.increaseTemperature(player, 1);
    }
}
