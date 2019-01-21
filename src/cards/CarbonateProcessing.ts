
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class CarbonateProcessing implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Carbonate Processing";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease your energy production 1 step and increase your heat production 3 steps.";
    public description: string = "Common minerals can be converted into carbon dioxide that increases the greenhouse effect.";
    public play(player: Player, game: Game): Promise<void> {
        if (player.energyProduction < 1) {
            return Promise.reject("Must have energy production");
        }
        player.energyProduction--;
        player.heatProduction += 3;
        return Promise.resolve();
    }
}
