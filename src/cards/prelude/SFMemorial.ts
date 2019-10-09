
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";

export class SFMemorial implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "SFMemorial";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Draw 1 card. Gain 1 victory point.";
    public description: string = "";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        player.victoryPoints++;
        player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
}
