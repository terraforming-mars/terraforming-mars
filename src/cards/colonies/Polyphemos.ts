import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class Polyphemos implements CorporationCard {
    public name: CardName = CardName.POLYPHEMOS;
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 50;

    public play(player: Player) {
        player.addProduction(Resources.MEGACREDITS, 5);
        player.titanium = 5;
        player.cardCost = 5;
        return undefined;
    }
}
