
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class FoodFactory implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Food Factory";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease your plant production 1 step and increase your mega credit production 4 steps. Gain 1 victory point.";
    public description: string = "For the growing population.";
    public play(player: Player, game: Game): Promise<void> {
        if (player.plantProduction < 1) {
            return Promise.reject("Must have plant production");
        }
        player.plantProduction--;
        player.megaCreditProduction += 4;
        player.victoryPoints++;
        return Promise.resolve();
    }
}
