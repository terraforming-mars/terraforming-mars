import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class Loan extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: CardName = CardName.LOAN;
    public bonusMc: number = 30;

    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.MEGACREDITS) >= -3;
    }    
    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,-2);
        player.megaCredits += this.bonusMc;
        return undefined;
    }
}

