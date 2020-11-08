import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";

export class Biofuels extends PreludeCard implements IProjectCard {
    public tags = [Tags.MICROBES];
    public name = CardName.BIOFUELS;
    public play(player: Player) {     
        player.addProduction(Resources.ENERGY);
        player.addProduction(Resources.PLANTS);
        player.plants += 2;
        return undefined;
    }
}

