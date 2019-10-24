
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";

export class HousePrinting implements IProjectCard {
    public cost: number = 10;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "House Printing";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your steel production 1 step. Gain 1 victory point.";
    public description: string = "Large scale 3D printing - on Mars";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.victoryPoints++;
        player.steelProduction++;
        return undefined;
    }
}
