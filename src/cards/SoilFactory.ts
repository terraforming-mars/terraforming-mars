
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class SoilFactory implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Soil Factory"
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease your energy production 1 step and increase your plant production 1 step";
    public description: string = "There are many harmful elements to remove";
    public play(player: Player, game: Game): Promise<void> {
        if (player.energyProduction < 1) {
            return Promise.reject("Must have energy production");
        }
        player.energyProduction--;
        player.plantProduction++;
        player.victoryPoints++;
        return Promise.resolve();
    } 
}
