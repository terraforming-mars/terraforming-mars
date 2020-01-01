import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';

export class NitrogenDelivery extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Nitrogen Shipment";
    public play(player: Player) {     
        player.megaCredits += 5;
        player.terraformRating++;
        player.setProduction(Resources.PLANTS);
        return undefined;
    }
}

