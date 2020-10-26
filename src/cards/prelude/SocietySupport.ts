import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";

export class SocietySupport extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: CardName = CardName.SOCIETY_SUPPORT;
    public play(player: Player) {     
        player.addProduction(Resources.MEGACREDITS, -1);
        player.addProduction(Resources.PLANTS);
        player.addProduction(Resources.ENERGY);
        player.addProduction(Resources.HEAT);			
        return undefined;
    }
}
