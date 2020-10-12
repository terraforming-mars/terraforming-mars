import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";

export class Midas implements CorporationCard {
    public name: CardName =  CardName.MIDAS;
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 120;
    public cardType: CardType = CardType.CORPORATION;

    public play(player: Player) {
        player.decreaseTerraformRatingSteps(7);
        return undefined;
    }
}
