
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
    public requirements: undefined;
    public description: string = "Taking a loan to fund that urgent project";
    public canPlay(player: Player): boolean {
        return player.megaCreditProduction >= -4;
    }
    public play(player: Player, _game: Game) {
        player.megaCreditProduction--;
        player.megaCredits += 10;
        return undefined;
    }
}
