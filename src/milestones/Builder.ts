import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "../cards/Tags";

export class Builder implements IMilestone {
    public name: string = "Builder";
    public description: string = "Having at least 8 building tags in play"
    public canClaim(player: Player, _game: Game): boolean {
        return player.getTagCount(Tags.STEEL) >= 8;
    }   
}