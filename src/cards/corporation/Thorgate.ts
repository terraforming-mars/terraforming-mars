
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { IProjectCard } from "../IProjectCard";
import { CorporationCard } from "./CorporationCard";

export class Thorgate implements CorporationCard {
    public name: string = "Thorgate";
    public tags: Array<Tags> = [Tags.ENERGY];
    public startingMegaCredits: number = 48;
    public text: string = "You start with 1 energy production";
    public effect: string = "When playing a power card or the standard project power plant, you pay 3 mega credits less for it.";
    public description: string = "As oil reserves ran out on Earth, Nordic ThorGate emerged as the new world leader in the energy field, with their cutting edge technology. Now that the colonies on Mars are growing, ThorGate leads the way in finding viable energy solutions.";
    public play(player: Player, _game: Game) {
        player.addCardDiscount((card: IProjectCard) => {
            if (card.tags.indexOf(Tags.ENERGY) !== -1) {
                return 3;
            }
            return 0;
        });
        player.powerPlantCost -= 3;
        player.energyProduction++;
        return undefined;
    }
}
 
