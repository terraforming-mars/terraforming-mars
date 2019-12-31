
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import { Resources } from '../Resources';

export class UndergroundDetonations implements IActionCard, IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Underground Detonations";
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
        return true;
    }
    public canAct(player: Player): boolean {
        return player.canAfford(10);
    }
    public action(player: Player, _game: Game) {
        if (player.canUseHeatAsMegaCredits && player.heat > 0) {
            return new SelectHowToPay("Select how to pay for action", false, false, true, (htp) => {
                if (htp.heat + htp.megaCredits < 10) {
                    throw "Need to spend 10";
                }
                player.heat -= htp.heat;
                player.megaCredits -= htp.megaCredits;
                player.setProduction(Resources.HEAT,2);
                return undefined;
            });
        }
        player.megaCredits -= 10;
        player.setProduction(Resources.HEAT,2);
        return undefined;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
}
