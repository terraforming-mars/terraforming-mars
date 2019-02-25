
import { Tags } from "../Tags";
import { CorporationCard } from "./CorporationCard";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { IProjectCard } from "../IProjectCard";

export class Teractor implements CorporationCard {
    public name: string = "Teractor";
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 60;
    public effect: string = "When playing an Earth card, you pay 3 mega credits less for it.";
    public text: string = "";
    public description: string = "Influence enough to control entire nations, and an army of lawyers and businessmen, has taken Teractor all the way to the top. And now the sky is calling. The strongest corporation on Earth wants to dominate space too...";
    public play(player: Player, _game: Game) {
        player.addCardDiscount((card: IProjectCard) => {
            if (card.tags.indexOf(Tags.EARTH) !== -1) {
                return 3;
            }
            return 0;
        });
        return undefined;
    }
}
