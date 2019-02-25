
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class NuclearPower implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: string = "Nuclear Power";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your mega credit production 2 steps and increase your energy production 3 steps";
    public description: string = "A simple way to satisfy your energy needs";
    public play(player: Player, _game: Game) {
        player.megaCreditProduction += 2;
        player.energyProduction += 3;
        return undefined;
    }
}
