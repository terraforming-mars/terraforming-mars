
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectAmount } from "../inputs/SelectAmount";

export class Insulation implements IProjectCard {
    public cost: number = 2;
    public tags: Array<Tags> = [];
    public name: string = "Insulation";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease your heat production any number of steps and increase your mega credit production the same number of steps";
    public description: string = "Better insulation means lower energy spending";
    public play(player: Player, _game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectAmount(this, "Select amount of heat production to decrease", (amount: number) => {
                if (amount > player.heatProduction) {
                    reject("Not enough heat production");
                    return;
                }
                player.heatProduction -= amount;
                player.megaCreditProduction += amount;
                resolve();
            }));
        });
    }
}
