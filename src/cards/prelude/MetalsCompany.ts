import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";

export class MetalsCompany extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.METALS_COMPANY;
    public play(player: Player) {     
        player.addProduction(Resources.MEGACREDITS);
        player.addProduction(Resources.TITANIUM);
        player.addProduction(Resources.STEEL);			
        return undefined;
    }
}
