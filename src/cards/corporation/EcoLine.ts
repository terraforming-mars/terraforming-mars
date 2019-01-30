
import { CorporationCard } from "./CorporationCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";

export class EcoLine implements CorporationCard {
    public name: string = "EcoLine";
    public tags: Array<Tags> = [Tags.PLANT];
    public startingMegaCredits: number = 36;
    public text: string = "You start with 2 plant production, and 3 plants.";
    public effect: string = "You may always pay 7 plants, instead of 8, to place 1 greenergy.";
    public description: string = "Having developed a fast-growing lichen suitable for early terraforming, this corporation's ambition is to lead the taming of the planets, despite its reliatively small size.";
    public play(player: Player, _game: Game): Promise<void> {
        player.plantProduction = 2;
        player.plants = 3;
        player.greeneryCost = 7;
        return Promise.resolve();
    }
}
