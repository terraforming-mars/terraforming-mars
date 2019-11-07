
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
    public requirements: undefined;
    public description: string = "Standard equipment, normal output";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.energyProduction++;
        return undefined;
    }
}

