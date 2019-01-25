
import { CardType } from "./CardType";
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectAmount } from "../inputs/SelectAmount";

export class PowerInfrastructure implements IActiveProjectCard {
    public name: string = "Power Infrastructure";
    public text: string = "";
    public description: string = "Efficiency through flexibility."
    public cardType: CardType = CardType.ACTIVE;
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public play(_player: Player, _game: Game): Promise<void> {
        return Promise.resolve();
    }
    public actionText: string = "Spend any amount of energy to gain that many mega credit";
    public action(player: Player, _game: Game): Promise<void> {
        if (player.energy === 0) {
            return Promise.reject("Have no energy to spend");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectAmount(this, "Select energy to spend"), (options: {[x: string]: string}) => {
                if (parseInt(options.option1) > player.energy) {
                    reject("You don't have that much energy");
                } else {
                    player.energy -= parseInt(options.option1);
                    player.megaCredits += parseInt(options.option1);
                    resolve();
                }
            });
        });
    }

}
