import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "../cards/Tags";

export class Builder implements IMilestone {
    public name: string = "Builder";
    public description: string = "Having at least 8 building tags in play"
    public getScore(player: Player, _game: Game): number {
        return player.getTagCount(Tags.STEEL);
    }
    public canClaim(player: Player, _game: Game): boolean {
        return this.getScore(player, _game) >= 8;
    }   
}