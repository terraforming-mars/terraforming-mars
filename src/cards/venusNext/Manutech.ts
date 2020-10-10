
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class Manutech implements CorporationCard {
    public name: CardName = CardName.MANUTECH;
    public tags: Array<Tags> = [Tags.STEEL];
    public startingMegaCredits: number = 35;

    public play(player: Player) {
        player.addProduction(Resources.STEEL);
        return undefined;
    }
}
