
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class TropicalResort implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Tropical Resort";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease your heat production 2 steps and increase your mega credit production 3 steps. Gain 2 victory points.";
    public description: string = "Utilizing heat production to attract tourists.";
    public play(player: Player, game: Game): Promise<void> {
        if (player.heatProduction < 2) {
            return Promise.reject("Must have 2 heat production");
        }
        player.heatProduction -= 2;
        player.megaCreditProduction += 3;
        player.victoryPoints += 2;
        return Promise.resolve();
    }
}
