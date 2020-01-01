import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";

export class SocietySupport extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Society Support";
    public play(player: Player) {     
        player.megaCreditProduction--;
        player.plantProduction++;
        player.setProduction(Resources.ENERGY);
        player.setProduction(Resources.HEAT);			
        return undefined;
    }
}

