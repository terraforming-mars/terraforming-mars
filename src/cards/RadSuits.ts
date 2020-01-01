
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";
import { Resources } from '../Resources';

export class RadSuits implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Rad-Suits";
    public canPlay(_player: Player, game: Game): boolean {
        return game.getCitiesInPlay() >= 2;
    }
    public play(player: Player, game: Game) {
        if (game.getCitiesInPlay() < 2) {
            throw "Must have 2 cities in play";
        }
        player.setProduction(Resources.MEGACREDITS);
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
