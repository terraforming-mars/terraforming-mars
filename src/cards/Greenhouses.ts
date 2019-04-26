
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Greenhouses implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.PLANT, Tags.STEEL];
    public name: string = "Greenhouses";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Gain 1 plant for each city tile in play";
    public description: string = "Places to conduct bio research and experiments.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        player.plants += game.getCitiesInPlay();
        return undefined;
    }
}
