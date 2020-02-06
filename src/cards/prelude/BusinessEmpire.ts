import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';

export class BusinessEmpire extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Business Empire";
    public hasRequirements = false;
    public canPlay(player: Player) {
        return player.canAfford(6);
    }
    public play(player: Player) {
	    player.megaCredits -= 6;
        player.setProduction(Resources.MEGACREDITS,6);
        return undefined;
    }
}

