
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { IProjectCard } from "../IProjectCard";
import { CorporationCard } from "./CorporationCard";

export class Thorgate implements CorporationCard {
    public name: string = "Thorgate";
    public tags: Array<Tags> = [Tags.ENERGY];
    public startingMegaCredits: number = 48;
    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.ENERGY) !== -1) {
            return 3;
        }
        return 0;
    }
    public play(player: Player, _game: Game) {
        player.powerPlantCost -= 3;
        player.energyProduction++;
        return undefined;
    }
}
 
