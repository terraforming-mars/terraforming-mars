
import { CorporationCard } from "./CorporationCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Resources } from '../../Resources';

export class EcoLine implements CorporationCard {
    public name: string = "EcoLine";
    public tags: Array<Tags> = [Tags.PLANT];
    public startingMegaCredits: number = 36;
    public play(player: Player) {
        player.setProduction(Resources.PLANTS,2);
        player.plants = 3;
        player.plantsNeededForGreenery = 7;
        return undefined;
    }
}
