import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";

export class Polyphemos implements CorporationCard {
    public name: CardName = CardName.POLYPHEMOS;
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 50;
    public cardType: CardType = CardType.CORPORATION;
    

    public play(player: Player) {
        player.addProduction(Resources.MEGACREDITS, 5);
        player.titanium = 5;
        player.cardCost = 5;
        return undefined;
    }
}
