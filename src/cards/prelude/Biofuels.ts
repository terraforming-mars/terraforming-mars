import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class Biofuels extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "Biofuels";
    public play(player: Player) {     
        player.energyProduction++;
        player.plantProduction++;
        player.plants += 2;
        return undefined;
    }
}

