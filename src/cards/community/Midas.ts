import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";

export class Midas implements CorporationCard {
    public name =  CardName.MIDAS;
    public tags = [];
    public startingMegaCredits: number = 120;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
        player.decreaseTerraformRatingSteps(7);
        return undefined;
    }
}
