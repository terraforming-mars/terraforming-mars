
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { IProjectCard } from "../IProjectCard";
import { CorporationCard } from "./CorporationCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";

export class Thorgate implements CorporationCard {
    public name = CardName.THORGATE;
    public tags = [Tags.ENERGY];
    public startingMegaCredits: number = 48;
    public cardType = CardType.CORPORATION;

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.ENERGY) !== -1) {
            return 3;
        }
        return 0;
    }
    public play(player: Player, _game: Game) {
        player.powerPlantCost -= 3;
        player.addProduction(Resources.ENERGY);
        return undefined;
    }
}
 
