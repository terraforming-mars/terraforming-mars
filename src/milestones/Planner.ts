import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";

export class Planner implements IMilestone {
    public name: string = "Planner";
    public description: string = "Having at least 16 cards in your hand when you claim this milestone"
    public getScore(player: Player, _game: Game): number {
        return player.cardsInHand.length;
    }
    public canClaim(player: Player, _game: Game): boolean {
        return this.getScore(player, _game) >= 16;
    }   
}