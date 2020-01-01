import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';

export class MartianIndustries extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Martian Industries";
    public play(player: Player) {
        player.setProduction(Resources.ENERGY);
        player.setProduction(Resources.STEEL);
        player.megaCredits += 6;
        return undefined;
    }
}

