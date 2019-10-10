
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { IProjectCard } from "../IProjectCard";
import { Game } from "../../Game";

export class CheungShingMARS implements CorporationCard {
    public name: string = "Cheung Shing MARS";
    public tags: Array<Tags> = [Tags.STEEL];
    public startingMegaCredits: number = 44;
    public text: string = "You start with 3 MC production and 44 MC. Effect: When you play a building tag, you pay 2 MC less for it.";
    public description: string = "An Asian company that has become a leader in industry and construction on Mars, Cheung Shing Mars is a force to be reckoned with";

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.STEEL) !== -1) {
            return 2;
        }
        return 0;
    }
	    
    public play(player: Player) {
        player.megaCreditProduction = 3;
        return undefined;
    }
}
