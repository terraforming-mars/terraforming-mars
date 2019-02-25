
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectAmount } from "../inputs/SelectAmount";

export class PowerInfrastructure implements IProjectCard {
    public name: string = "Power Infrastructure";
    public text: string = "";
    public description: string = "Efficiency through flexibility."
    public cardType: CardType = CardType.ACTIVE;
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public actionText: string = "Spend any amount of energy to gain that many mega credit";
    public action(player: Player, _game: Game) {
        if (player.energy === 0) {
            throw "Have no energy to spend";
        }
        return new SelectAmount(this.name, "Select energy to spend", (amount: number) => {
            if (amount > player.energy) {
                throw "You don't have that much energy";
            }
            player.energy -= amount;
            player.megaCredits += amount;
            return undefined;
        });
    }
}
