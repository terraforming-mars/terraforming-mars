
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Research implements IProjectCard {
    public cost: number = 11;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.SCIENCE];
    public name: string = "Research";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Counts as playing 2 science cards. Draw 2 cards. Gain 1 victory point.";
    public requirements: undefined;
    public description: string = "Through technical excellence you will unlock many wondrous things";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        player.victoryPoints++;
        for (let i = 0; i < 2; i++) {
            player.cardsInHand.push(game.dealer.dealCard());
        }
        return undefined;
    }
}
