import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';

export class MetalsCompany extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Metals Company";
    public play(player: Player) {     
        player.setProduction(Resources.MEGACREDITS);
        player.setProduction(Resources.TITANIUM);
        player.setProduction(Resources.STEEL);			
        return undefined;
    }
}

