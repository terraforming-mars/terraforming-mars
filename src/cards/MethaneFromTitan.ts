
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class MethaneFromTitan implements IProjectCard {
    public cost: number = 28;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = "Methane From Titan";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 2% oxygen. Increase your heat production 2 steps and your plant production 2 steps. Gain 2 victory points.";
    public description: string = "Using Titan's liquid methane as fuel will add carbon and heat to Mars.";
    public play(player: Player, game: Game) {
        if (game.getOxygenLevel() < 2) {
            throw "Requires 2% oxygen";
        }
        player.heatProduction += 2;
        player.plantProduction += 2;
        player.victoryPoints += 2;
        return undefined;
    }
}
