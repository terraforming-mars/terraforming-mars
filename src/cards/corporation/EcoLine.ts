
import { CorporationCard } from "./CorporationCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";

export class EcoLine implements CorporationCard {
    public name: string = "EcoLine";
    public tags: Array<Tags> = [Tags.PLANT];
    public startingMegaCredits: number = 36;
    public play(player: Player, _game: Game) {
        player.plantProduction = 2;
        player.plants = 3;
        player.plantsNeededForGreenery = 7;
        return undefined;
    }
}
