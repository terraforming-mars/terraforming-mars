
import { Player } from "../Player";
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import { Resources } from '../Resources';

export class SpaceMirrors implements IActionCard, IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.SPACE];
    public name: string = "Space Mirrors";
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
        return true;
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.canAfford(7);
    }
    public action(player: Player) {
        if (player.canUseHeatAsMegaCredits && player.heat > 0) {
            return new SelectHowToPay("Select how to pay for action", false, false, true, (htp) => {
                if (htp.megaCredits + htp.heat < 7) {
                    throw "Not enough spent";
                }
                player.megaCredits -= htp.megaCredits;
                player.heat -= htp.heat;
                player.setProduction(Resources.ENERGY);
                return undefined;
            });
        }
        player.megaCredits -= 7;
        player.setProduction(Resources.ENERGY);
        return undefined;
    }
}
