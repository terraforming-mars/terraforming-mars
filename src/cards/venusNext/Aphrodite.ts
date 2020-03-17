
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class Aphrodite implements CorporationCard {
    public name: string = CardName.APHRODITE;
    public tags: Array<Tags> = [Tags.PLANT,Tags.VENUS];
    public startingMegaCredits: number = 47;

    public play(player: Player) {
        player.setProduction(Resources.PLANTS);
        return undefined;
    }
}
