
import { CorporationCard } from "./CorporationCard";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { Tags } from "../Tags";
import { StandardProjectType } from "../../StandardProjectType";
import { IProjectCard } from "../IProjectCard";

export class CrediCor implements CorporationCard {
    public name: string = "CrediCor";
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 57;
    public text: string = "After you pay for a card or standard project with a basic cost of 20 mega credits or more, you gain 4 mega credits.";
    public description: string = "Multibillionaire Bard Hunter likes terraforming, especially when it involves hurling asteroids at Mars. He also has a hunch that it's going to pay off. His company CrediCor has all the resources he needs to jump right into the contest.";
    public play(player: Player, _game: Game) {
        player.addStandardProjectHandler((project: StandardProjectType) => {
            if (project === StandardProjectType.GREENERY || project === StandardProjectType.CITY) {
                player.megaCredits += 4;
            }
        });
        player.addCardPlayedHandler((card: IProjectCard) => {
            if (card.cost >= 20) {
                player.megaCredits += 4;
            }
        });
        return undefined;
    }
}
