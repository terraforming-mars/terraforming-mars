
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Algae implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Algae";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 5 ocean tiles. Gain 1 plant and increase your plant production 2 steps.";
    public description: string = "Basic photosynthesizers in aqueous environments";
    public play(player: Player, game: Game) {
        if (game.getOceansOnBoard() < 5) {
            throw "Requires 5 ocean tiles";
        }
        player.plants++;
        player.plantProduction += 2;
        return undefined;
    }
}
