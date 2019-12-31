import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';

export class MoholeExcavation extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Mohole Excavation";
    public play(player: Player) {     
        player.steelProduction++;
        player.setProduction(Resources.HEAT,2);
        player.heat += 2;
        return undefined;
    }
}

