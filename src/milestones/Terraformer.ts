import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";

export class Terraformer implements IMilestone {
    public name: string = "Terraformer";
    private terraformRating: number = 35;
    private terraformRatingTurmoil: number = 26;
    public description: string = "Having a terraform rating of at least "+this.terraformRating+ " or " + this.terraformRatingTurmoil + " with Turmoil.";
    public canClaim(player: Player, game: Game): boolean {
        if (game.turmoilExtension) {
            return player.getTerraformRating() >= this.terraformRatingTurmoil;
        }
        return player.getTerraformRating() >= this.terraformRating;
    }   
}