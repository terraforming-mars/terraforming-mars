
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";

export class GHGFactories implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "GHG Factories";
    public text: string = "Decrease your energy production 1 step and increase your heat production 4 steps";
    public description: string = "Synthesizing powerful greenhouse gases (GHGs), releasing them into the atmosphere";
    public play(player: Player, _game: Game): Promise<void> {
        if (player.energyProduction < 1) {
            return Promise.reject("Must have energy production to decrease");
        }
        player.energyProduction--;
        player.heatProduction += 4;
        return Promise.resolve();
    }
}

