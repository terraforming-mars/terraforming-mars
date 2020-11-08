import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { IProjectCard } from "../IProjectCard";
import { Game } from "../../Game";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";

export class CheungShingMARS implements CorporationCard {
    public name = CardName.CHEUNG_SHING_MARS;
    public tags = [Tags.STEEL];
    public startingMegaCredits: number = 44;
    public cardType = CardType.CORPORATION;

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        return card.tags.filter(tag => tag === Tags.STEEL).length * 2;
    }
	    
    public play(player: Player) {
        player.addProduction(Resources.MEGACREDITS, 3);
        return undefined;
    }
}
