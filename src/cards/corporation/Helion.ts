
import { CorporationCard } from "./CorporationCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";

export class Helion implements CorporationCard {
    public name: string = "Helion";
    public tags: Array<Tags> = [Tags.SPACE];
    public startingMegaCredits: number = 42;
    public text: string = "You start with 3 heat production. You may use heat as mega credits. You may not use mega credits as heat.";
    public requirements: undefined;
    public description: string = "Developers of ultra-light solar sails, Helion now turns to the terraforming of Mars and other worlds. It promises to be a rewarding business, as Helion has already made a working model of a soletta, focusing sunlight down to the frozen planet.";
    public play(player: Player) {
        player.canUseHeatAsMegaCredits = true;
        player.heatProduction = 3;
        return undefined;
    }
}
