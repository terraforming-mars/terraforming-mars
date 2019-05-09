
import { Player } from "../Player";
import { Game } from "../Game";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { SelectHowToPay } from "../inputs/SelectHowToPay";

export class SpaceMirrors implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.SPACE];
    public name: string = "Space Mirror";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Spend 7 mega credit to increase your energy production 1 step.";
    public description: string = "Ultrathin mirrors reflecting sunlight down to receivers on the surface.";
    public text: string = "";
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public action(player: Player, _game: Game) {
        if (player.canUseHeatAsMegaCredits && player.heat > 0) {
            if (player.heat + player.megaCredits < 7) {
                throw "Requires 7 mega credit or heat";
            }
            return new SelectHowToPay(this.name, "How to pay", false, false, true, (htp) => {
                if (htp.megaCredits + htp.heat < 7) {
                    throw "Not enough spent";
                }
                player.megaCredits -= htp.megaCredits;
                player.heat -= htp.heat;
                player.energyProduction++;
                return undefined;
            });
        }
        if (player.megaCredits < 7) {
            throw "Requires 7 mega credit";
        }
        player.megaCredits -= 7;
        player.energyProduction++;
        return undefined;
    }
}
