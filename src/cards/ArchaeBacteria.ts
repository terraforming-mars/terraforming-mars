import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class ArchaeBacteria implements IProjectCard {
    public cost: number = 6;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "ArchaeBacteria";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "It must be -18C or colder. Increase your plant production 1 step.";
    public requirements: string = "-18C or Colder";
    public description: string = "Photosynthesizing bacteria specializing in extreme environments.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() <= -18 + (player.getRequirementsBonus(game) * 2);
    }
    public play(player: Player) {
        player.plantProduction++;
        return undefined;
    }
}