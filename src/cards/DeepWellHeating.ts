
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class DeepWellHeating implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: string = "Deep Well Heating";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your energy production 1 step. Increase temperature 1 step";
    public description: string = "Digging deep to find heat from the core";
    public play(player: Player, game: Game) {
        player.energyProduction++;
        return game.increaseTemperature(player, 1);
    }
}
