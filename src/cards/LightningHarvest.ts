
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class LightningHarvest implements IProjectCard {
    public cost: number = 8;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Lightning Harvest";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 3 science tags. Increase your energy production and your mega credit production 1 step each. Gain 1 victory point.";
    public requirements: string = "3 Science";
    public description: string = "Floating supercapacitors connecting clouds with a superconducting wire. The triggered and collected discharges are beamed down to a receptor. Gain 1 victory point.";
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 3;
    }
    public play(player: Player, _game: Game) {
        if (player.getTagCount(Tags.SCIENCE) < 3) {
            throw "Requires 3 science tags";
        }
        player.energyProduction++;
        player.megaCreditProduction++;
        player.victoryPoints++;
        return undefined;
    }
}
