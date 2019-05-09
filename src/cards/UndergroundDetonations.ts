
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectHowToPay } from "../inputs/SelectHowToPay";

export class UndergroundDetonations implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Underground Detonations";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Spend 10 mega credit to increase your heat production 2 steps.";
    public description: string = "Radiation from the nuclear blast is shielded, but over time, we are still getting the heat.";
    public text: string = "";
    public canPlay(): boolean {
        return true;
    }
    public action(player: Player, _game: Game) {
        if (player.canUseHeatAsMegaCredits && player.heat > 0) {
            if (player.heat + player.megaCredits < 10) {
                throw "Must have 10 mega credits or heat to spend";
            }
            return new SelectHowToPay(this.name, "How to pay", false, false, true, (htp) => {
                if (htp.heat + htp.megaCredits < 10) {
                    throw "Need to spend 10";
                }
                player.heat -= htp.heat;
                player.megaCredits -= htp.megaCredits;
                player.heatProduction += 2;
                return undefined;
            });
        }
        if (player.megaCredits < 10) {
            throw "Must have 10 mega credits to spend";
        }
        player.megaCredits -= 10;
        player.heatProduction += 2;
        return undefined;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
}
