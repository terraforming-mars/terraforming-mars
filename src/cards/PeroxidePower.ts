
import { Tags } from "./Tags";
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";

export class PeroxidePower implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Peroxide Power";
    public text: string = "Decrease your mega credit production 1 step and increase your energy production 2 steps.";
    public description: string = "The Martian ground is full of oxidizing agents.";
    public play(player: Player, _game: Game): Promise<void> {
        player.megaCreditProduction--;
        player.energyProduction += 2;
        return Promise.resolve();
    }
}
