
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { IProjectCard } from "../IProjectCard";
import { Game } from "../../Game";
import { Resources } from '../../Resources';

export class CheungShingMARS implements CorporationCard {
    public name: string = "Cheung Shing MARS";
    public tags: Array<Tags> = [Tags.STEEL];
    public startingMegaCredits: number = 44;

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.STEEL) !== -1) {
            return 2;
        }
        return 0;
    }
	    
    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,3);
        return undefined;
    }
}
