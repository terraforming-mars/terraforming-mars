import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { CardName } from '../../CardName';

export class TerralabsResearch implements CorporationCard {
    public name: CardName = CardName.TERRALABS_RESEARCH;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.EARTH];
    public startingMegaCredits: number = 14;

    public play(player: Player) {
        player.decreaseTerraformRating();
        player.cardCost = 1;
        return undefined;
    }
}
