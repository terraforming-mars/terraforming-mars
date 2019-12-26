
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
    public canPlay(player: Player): boolean {
        return player.heatProduction >= 2;
    }
    public play(player: Player, _game: Game) {
        if (player.heatProduction < 2) {
            throw "Must have 2 heat production";
        }
        player.heatProduction -= 2;
        player.megaCreditProduction += 3;
        return undefined;
    }
    public getVictoryPoints() {
        return 2;
    }
}
