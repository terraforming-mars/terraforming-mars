
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";

export class MicroMills implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Micro-Mills";
    public text: string = "Increase your heat production 1 step";
    public description: string = "Small, mass-produced windmills that convert some of the ever-present wind into heat.";
    public play(player: Player, _game: Game): Promise<void> {
        player.heatProduction++;
        return Promise.resolve();
    }
}

