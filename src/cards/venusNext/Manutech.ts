
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";

export class Manutech implements CorporationCard {
    public name: CardName = CardName.MANUTECH;
    public tags: Array<Tags> = [Tags.STEEL];
    public startingMegaCredits: number = 35;
    public cardType: CardType = CardType.CORPORATION;

    public play(player: Player) {
        player.addProduction(Resources.STEEL);
        return undefined;
    }
}
