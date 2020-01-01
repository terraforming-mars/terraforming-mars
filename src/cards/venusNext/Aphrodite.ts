
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";

export class Aphrodite implements CorporationCard {
    public name: string = "Aphrodite";
    public tags: Array<Tags> = [Tags.PLANT,Tags.VENUS];
    public startingMegaCredits: number = 47;

    public play(player: Player) {
        player.plantProduction = 1;
        return undefined;
    }
}
