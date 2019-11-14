import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Algae implements IProjectCard {
    public cost: number = 10;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Algae";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 5 ocean tiles. Gain 1 plant and increase your plant production 2 steps.";
    public requirements: string = "5 Oceans";
    public description: string = "Basic photosynthesizers in aqueous environments";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOceansOnBoard() >= 5 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.plants++;
        player.plantProduction += 2;
        return undefined;
    }
}