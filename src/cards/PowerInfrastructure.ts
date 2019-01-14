
import { CardType } from "./CardType";
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";

export class PowerInfrastructure implements IActiveProjectCard {
    public name: string = "Power Infrastructure";
    public text: string = "Action: Spend any amount of energy to gain that amount of mega credits.";
    public description: string = "Efficiency through flexibility."
    public cardType: CardType = CardType.ACTIVE;
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public play(player: Player, game: Game): void {
        // Nothing happens when played
    }
    public actionText: string = "Spend any amount of energy to gain that many mega credit";
    public action(player: Player, game: Game): Promise<void> {
        if (player.energy === 0) {
            throw "Have no energy to spend";
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectAmount"
            }, (input: string) => {
                if (parseInt(input) > player.energy) {
                    reject("You don't have that much energy");
                } else {
                    player.energy -= parseInt(input);
                    player.megaCredits += parseInt(input);
                    resolve();
                }
            });
        });
    }

}
