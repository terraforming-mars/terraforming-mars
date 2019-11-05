import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { TileType } from "../TileType";

export class Gardener implements IMilestone {
    public name: string = "Gardener";
    public canClaim(player: Player, game: Game): boolean {
        return !game.milestoneClaimed(this) && game.getSpaceCount(TileType.GREENERY, player) >= 3;
    }   
}