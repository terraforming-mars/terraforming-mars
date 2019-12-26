
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";

export class LagrangeObservatory implements IProjectCard {
    public cardType: CardType = CardType.AUTOMATED;
    public cost: number = 9;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.SPACE];
    public name: string = "Lagrange Observatory";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        player.cardsInHand.push(game.dealer.dealCard());
        player.victoryPoints++;
        return undefined;
    }
}
