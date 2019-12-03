
import { CardType } from "./CardType";
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectAmount } from "../inputs/SelectAmount";

export class PowerInfrastructure implements IActionCard, IProjectCard {
    public name: string = "Power Infrastructure";
    public cardType: CardType = CardType.ACTIVE;
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.energy > 0;
    }
    public action(player: Player, _game: Game) {
        return new SelectAmount("Select energy to spend", (amount: number) => {
            player.energy -= amount;
            player.megaCredits += amount;
            return undefined;
        }, player.energy);
    }
}
