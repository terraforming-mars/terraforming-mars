import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";

export class BiosphereSupport extends PreludeCard implements IProjectCard {
    public tags = [Tags.PLANT];
    public name = CardName.BIOSPHERE_SUPPORT;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.MEGACREDITS) >= -4;
    }    
    public play(player: Player) {
        player.addProduction(Resources.MEGACREDITS, -1);
        player.addProduction(Resources.PLANTS, 2);
	    return undefined;    
    }
}

