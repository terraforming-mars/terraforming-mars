
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class ArchaeBacteria implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "ArchaeBacteria";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "It must be -18C or colder. Increase your plant production 1 step.";
    public description: string = "Photosynthesizing bacteria specializing in extreme environments.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getTemperature() > -18) {
            return Promise.reject("It must be -18C or colder.");
        }
        player.plantProduction++;
        return Promise.resolve();
    }
}

