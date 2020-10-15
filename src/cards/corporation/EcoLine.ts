
import { CorporationCard } from "./CorporationCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";


export class EcoLine implements CorporationCard {
    public name: CardName = CardName.ECOLINE;
    public tags: Array<Tags> = [Tags.PLANT];
    public startingMegaCredits: number = 36;
    public cardType: CardType = CardType.CORPORATION;
    public play(player: Player) {
        player.addProduction(Resources.PLANTS,2);
        player.plants = 3;
        player.plantsNeededForGreenery = 7;
        return undefined;
    }
}
