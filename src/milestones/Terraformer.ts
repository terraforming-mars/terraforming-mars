import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";

export class Terraformer implements IMilestone {
    public name: string = "Terraformer";
    public description: string = "Having a terraform rating of at least 35"
    public canClaim(player: Player, _game: Game): boolean {
        return player.terraformRating >= 35;
    }   
}