import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";

export class Terraformer implements IMilestone {
    public name: string = "Terraformer";
    public canClaim(player: Player, game: Game): boolean {
        return !game.milestoneClaimed(this) && player.terraformRating >= 35;
    }   
}