import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { TileType } from "../TileType";

export class Mayor implements IMilestone {
    public name: string = "Mayor";
    public canClaim(player: Player, game: Game): boolean {
        return !game.milestoneClaimed(this) && game.getSpaceCount(TileType.CITY, player) >= 3;
    }   
}