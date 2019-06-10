
import { Tags } from "../Tags";
import { CorporationCard } from "./CorporationCard";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { IProjectCard } from "../IProjectCard";

export class Teractor implements CorporationCard {
    public name: string = "Teractor";
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 60;
    public text: string = "When playing an Earth card, you pay 3 mega credits less for it.";
    public description: string = "Influence enough to control entire nations, and an army of lawyers and businessmen, has taken Teractor all the way to the top. And now the sky is calling. The strongest corporation on Earth wants to dominate space too...";
    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.EARTH) !== -1) {
            return 3;
        }
        return 0;
    }
    public play() {
        return undefined;
    }
}
