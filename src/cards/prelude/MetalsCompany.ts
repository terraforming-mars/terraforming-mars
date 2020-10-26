import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";

export class MetalsCompany extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: CardName = CardName.METALS_COMPANY;
    public play(player: Player) {     
        player.addProduction(Resources.MEGACREDITS);
        player.addProduction(Resources.TITANIUM);
        player.addProduction(Resources.STEEL);			
        return undefined;
    }
}
