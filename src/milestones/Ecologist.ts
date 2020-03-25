import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from '../cards/Tags';

export class Ecologist implements IMilestone {
    public name: string = "Ecologist";
    public description: string = "Requires that you have 4 bio tags (plant, microbe and animal tags count as bio tags)"
    public canClaim(player: Player, _game: Game): boolean {
        const tags: Array<Tags> = [Tags.PLANT, Tags.ANIMAL, Tags.MICROBES];
        return player.getMultipleTagCount(tags) >= 4;
    }   
}