
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
    public requirements: undefined;
    public description: string = "Synthesizing powerful greenhouse gases (GHGs), releasing them into the atmosphere";
    public canPlay(player: Player): boolean {
        return player.energyProduction >= 1;
    }
    public play(player: Player, _game: Game) {
        if (player.energyProduction < 1) {
            throw "Must have energy production to decrease";
        }
        player.energyProduction--;
        player.heatProduction += 4;
        return undefined;
    }
}

