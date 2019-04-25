
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class TropicalResort implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Tropical Resort";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease your heat production 2 steps and increase your mega credit production 3 steps. Gain 2 victory points.";
    public description: string = "Utilizing heat production to attract tourists.";
    public canPlay(player: Player): boolean {
        return player.heatProduction >= 2;
    }
    public play(player: Player, _game: Game) {
        if (player.heatProduction < 2) {
            throw "Must have 2 heat production";
        }
        player.heatProduction -= 2;
        player.megaCreditProduction += 3;
        player.victoryPoints += 2;
        return undefined;
    }
}
