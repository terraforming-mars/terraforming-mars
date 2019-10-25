
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";

export class RadSuits implements IProjectCard {
    public cost: number = 6;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Rad-Suits";
    public text: string = "Requires 2 cities in play. Increase your mega credit production 1 step. Gain 1 victory point.";
    public description: string = "New synthetic fabrics, able to protect from cosmic ratiation, are becoming high fashion";
    public canPlay(_player: Player, game: Game): boolean {
        return game.getCitiesInPlay() >= 2;
    }
    public play(player: Player, game: Game) {
        if (game.getCitiesInPlay() < 2) {
            throw "Must have 2 cities in play";
        }
        player.megaCreditProduction++;
        player.victoryPoints++;
        return undefined;
    }
}
