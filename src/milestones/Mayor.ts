import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";

export class Mayor implements IMilestone {
    public name: string = "Mayor";
    public description: string = "Owning at least 3 city tiles"
    public canClaim(player: Player, game: Game): boolean {
        return player.getCitiesCount(game) >= 3;
    }   
}