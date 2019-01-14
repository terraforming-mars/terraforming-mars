
import { Tags } from "./Tags";
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";

export class InvestmentLoan implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.EARTH];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Investment Loan";
    public text: string = "Decrease your mega credit production 1 step. Gain 10 mega credit";
    public description: string = "Taking a loan to fund that urgent project";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (player.megaCreditProduction < 1) {
                reject("Need at least 1 mega credit production to decrease");
                return;
            }
            player.megaCreditProduction--;
            player.megaCredits += 10;
            resolve();
        });
    }
}
