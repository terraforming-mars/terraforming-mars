
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class KelpFarming implements IProjectCard {
    public cost: number = 17;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Kelp Farming";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 6 ocean tiles. Increase your mega credit production 2 steps and your plant production 3 steps. Gain 2 plants. Gain 1 victory point.";
    public description: string = "The newly formed oceans are very rich in minerals, perfect for food production.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOceansOnBoard() >= 6 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.megaCreditProduction += 2;
        player.plantProduction += 3;
        player.plants += 2;
        player.victoryPoints++;
        return undefined;
    }
}
