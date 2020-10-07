
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class Aphrodite implements CorporationCard {
    public name: CardName = CardName.APHRODITE;
    public tags: Array<Tags> = [Tags.PLANT,Tags.VENUS];
    public startingMegaCredits: number = 47;

    public play(player: Player) {
        player.addProduction(Resources.PLANTS);
        return undefined;
    }
}
