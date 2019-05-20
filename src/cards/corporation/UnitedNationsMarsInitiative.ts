
import { IActionCard } from "../ICard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CorporationCard } from "./CorporationCard";

export class UnitedNationsMarsInitiative implements IActionCard, CorporationCard {
    public name: string = "United Nations Mars Initiative";
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 40;
    public actionText: string = "If your terraform rating was raised this generation, you may pay 3 mega credit to raise it 1 step more.";
    public text: string = "";
    public generationStartRating: number = 20;
    public description: string = "UNMI is the organization carrying out the World Government's own terraforming projects. After the terraforming announcement, the UNMI got competition from different corporations, but is still a major force behind Mars' development.";
    public play(player: Player, game: Game) {
        this.generationStartRating = player.terraformRating;
        game.addGenerationEndListener(() => {
            this.generationStartRating = player.terraformRating;
        });
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.terraformRating >= this.generationStartRating && player.canAfford(3); 
    }
    public action(player: Player, _game: Game) {
        player.megaCredits -= 3;
        player.terraformRating++;
        return undefined;
    }
}
