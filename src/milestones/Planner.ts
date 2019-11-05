import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";

export class Planner implements IMilestone {
    public name: string = "Planner";
    public canClaim(player: Player, game: Game): boolean {
        return !game.milestoneClaimed(this) && player.cardsInHand.length >= 16;
    }   
}