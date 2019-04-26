
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class FueledGenerators implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Fueled Generators";
    public text: string = "Decrease your mega credit production 1 step and increase your energy production 1 step";
    public description: string = "Simple but limited power supply";
    public canPlay(player: Player): boolean {
        return player.megaCreditProduction >= -4;
    }
    public play(player: Player, _game: Game) {
        player.megaCreditProduction--;
        player.energyProduction++;
        return undefined;
    }
}
