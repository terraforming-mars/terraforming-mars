import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';

export class BiosphereSupport extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Biosphere Support";
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.MEGACREDITS) >= -4;
    }    
    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,-1);
        player.setProduction(Resources.PLANTS,2);
	    return undefined;    
    }
}

