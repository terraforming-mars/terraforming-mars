import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { CardType } from "../cards/CardType";

export class Legend implements IMilestone {
    public name: string = "Legend";
    public description: string = "Requires that you have played 5 events"
    public getScore(player: Player): number {
        return player.playedCards
          .filter((card) => card.cardType === CardType.EVENT).length;
    }
    public canClaim(player: Player): boolean {
        return this.getScore(player) > 4;
    }   
}