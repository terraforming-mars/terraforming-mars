
import { IActionCard } from "../ICard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CorporationCard } from "./CorporationCard";

export class UnitedNationsMarsInitiative implements IActionCard, CorporationCard {
    public name: string = "United Nations Mars Initiative";
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 40;
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.terraformRating > player.terraformRatingAtGenerationStart && player.canAfford(3); 
    }
    public action(player: Player, _game: Game) {
        player.megaCredits -= 3;
        player.terraformRating++;
        return undefined;
    }
}
