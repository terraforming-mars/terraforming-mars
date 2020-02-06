
import { Tags } from "./Tags";
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";
import { Resources } from '../Resources';

export class InvestmentLoan implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.EARTH];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Investment Loan";
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.MEGACREDITS) >= -4;
    }
    public play(player: Player, _game: Game) {
        player.setProduction(Resources.MEGACREDITS,-1);
        player.megaCredits += 10;
        return undefined;
    }
}
