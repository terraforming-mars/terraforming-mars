import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class NitrogenDelivery extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = CardName.NITROGEN_SHIPMENT;
    public play(player: Player) {     
        player.megaCredits += 5;
        player.terraformRating++;
        player.setProduction(Resources.PLANTS);
        return undefined;
    }
}

