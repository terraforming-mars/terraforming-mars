
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';

export class NitrogenRichAsteroid implements IProjectCard {
    public cost: number = 31;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Nitrogen-Rich Asteroid";
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
        player.terraformRating += 2;
        if (player.getTagCount(Tags.PLANT) < 3) {
            player.setProduction(Resources.PLANTS);
        } else {
            player.setProduction(Resources.PLANTS,4);
        }
        return game.increaseTemperature(player, 1);
    }
}
