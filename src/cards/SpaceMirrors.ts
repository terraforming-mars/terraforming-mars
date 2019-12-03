
import { Player } from "../Player";
import { Game } from "../Game";
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { SelectHowToPay } from "../inputs/SelectHowToPay";

export class SpaceMirrors implements IActionCard, IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.SPACE];
    public name: string = "Space Mirrors";
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.canAfford(7);
    }
    public action(player: Player, _game: Game) {
        if (player.canUseHeatAsMegaCredits && player.heat > 0) {
            return new SelectHowToPay("Select how to pay for action", false, false, true, false, (htp) => {
                if (htp.megaCredits + htp.heat < 7) {
                    throw "Not enough spent";
                }
                player.megaCredits -= htp.megaCredits;
                player.heat -= htp.heat;
                player.energyProduction++;
                return undefined;
            });
        }
        player.megaCredits -= 7;
        player.energyProduction++;
        return undefined;
    }
}
