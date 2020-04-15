
import { IActionCard } from "../ICard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CorporationCard } from "./CorporationCard";
import { CardName } from '../../CardName';

export class UnitedNationsMarsInitiative implements IActionCard, CorporationCard {
    public name: CardName = CardName.UNITED_NATIONS_MARS_INITIATIVE;
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 40;
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.getTerraformRating() > player.terraformRatingAtGenerationStart && player.canAfford(3); 
    }
    public action(player: Player, game: Game) {
        player.megaCredits -= 3;
        player.increaseTerraformRating(game);
        return undefined;
    }
}
