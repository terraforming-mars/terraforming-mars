import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";

export class MoholeExcavation extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.MOHOLE_EXCAVATION;
    public play(player: Player) {     
        player.addProduction(Resources.STEEL);
        player.addProduction(Resources.HEAT, 2);
        player.heat += 2;
        return undefined;
    }
}
