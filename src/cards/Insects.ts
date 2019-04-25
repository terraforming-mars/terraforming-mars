
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Insects implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Insects";
    public text: string = "Requires 6% oxygen. Increase your plant production 1 step for each plant tag you have.";
    public description: string = "Pollinating flowers and spreading seeds.";
    public canPlay(_player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 6;
    }
    public play(player: Player, game: Game) {
        if (game.getOxygenLevel() < 6) {
            throw "Requires 6% oxygen";
        }
        player.plantProduction += player.getTagCount(Tags.PLANT);
        return undefined;
    }
}
