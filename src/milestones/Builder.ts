import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "../cards/Tags";

export class Builder implements IMilestone {
    public name: string = "Builder";
    public canClaim(player: Player, _game: Game): boolean {
        return player.getTagCount(Tags.STEEL) >= 8;
    }   
}