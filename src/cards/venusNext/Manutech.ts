
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Resources } from '../../Resources';

export class Manutech implements CorporationCard {
    public name: string = "Manutech";
    public tags: Array<Tags> = [Tags.STEEL];
    public startingMegaCredits: number = 35;

    public play(player: Player) {
        player.setProduction(Resources.STEEL);
        return undefined;
    }
}
