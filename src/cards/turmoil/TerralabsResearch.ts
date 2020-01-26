import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { CorporationName } from '../../CorporationName';

export class TerralabsResearch implements CorporationCard {
    public name: string = CorporationName.TERRALABS_RESEARCH;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.EARTH];
    public startingMegaCredits: number = 14;

    public play(player: Player) {
        player.terraformRating --;
        player.cardCost = 1;
        return undefined;
    }
}
