
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class SoilFactory implements IProjectCard {
    public cost: number = 9;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Soil Factory"
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease your energy production 1 step and increase your plant production 1 step. Gain 1 victory point.";
    public description: string = "There are many harmful elements to remove";
    public canPlay(player: Player): boolean {
        return player.energyProduction >= 1;
    }
    public play(player: Player, _game: Game) {
        if (player.energyProduction < 1) {
            throw "Must have energy production";
        }
        player.energyProduction--;
        player.plantProduction++;
        player.victoryPoints++;
        return undefined;
    } 
}
