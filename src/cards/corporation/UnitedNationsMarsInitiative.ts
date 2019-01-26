
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CorporationCard } from "./CorporationCard";

export class UnitedNationsMarsInitiative extends CorporationCard {
    public name: string = "United Nations Mars Initiative";
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 40;
    public actionText: string = "If your terraform rating was raised this generation, you may pay 3 mega credit to raise it 1 step more.";
    public text: string = "";
    private generationStartRating: number = 20;
    public description: string = "UNMI is the organization carrying out the World Government's own terraforming projects. After the terraforming announcement, the UNMI got competition from different corporations, but is still a major force behind Mars' development.";
    public play(player: Player, game: Game): Promise<void> {
        this.generationStartRating = player.terraformRating;
        game.addGenerationEndListener(() => {
            this.generationStartRating = player.terraformRating;
        });
        return Promise.resolve();
    }
    public action(player: Player, _game: Game): Promise<void> {
        if (player.terraformRating <= this.generationStartRating) {
            return Promise.reject("Terraform rating must be raised to perform action");
        }
        if (player.megaCredits < 3) {
            return Promise.reject("Need 3 mega credits");
        }
        player.megaCredits -= 3;
        player.terraformRating++;
        return Promise.resolve();
    }
}
