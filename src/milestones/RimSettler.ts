import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from '../cards/Tags';

export class RimSettler implements IMilestone {
    public name: string = "Rim Settler";
    public description: string = "Requires that you have 3 jovian tags"
    public getScore(player: Player, _game: Game): number {
        return player.getTagCount(Tags.JOVIAN);
    }
    public canClaim(player: Player, _game: Game): boolean {
        return this.getScore(player, _game) >= 3;
    }   
}