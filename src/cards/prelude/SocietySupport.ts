import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from '../../CardName';

export class SocietySupport extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = CardName.SOCIETY_SUPPORT;
    public play(player: Player) {     
        player.setProduction(Resources.MEGACREDITS,-1);
        player.setProduction(Resources.PLANTS);
        player.setProduction(Resources.ENERGY);
        player.setProduction(Resources.HEAT);			
        return undefined;
    }
}

