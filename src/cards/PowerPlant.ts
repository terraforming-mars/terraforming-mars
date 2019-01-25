
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class PowerPlant implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: string = "Power Plant";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your energy production 1 step";
    public description: string = "Standard equipment, normal output";
    public play(player: Player, _game: Game): Promise<void> {
        player.energyProduction++;
        return Promise.resolve();
    }
}

